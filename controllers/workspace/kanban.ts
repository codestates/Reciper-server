import { Parts } from '../../src/entity/Parts';
import { Task_boxes } from '../../src/entity/Task_boxes';
import app from '../../app';
import { Socket } from '../../node_modules/socket.io/dist/socket';
import { getRepository } from 'typeorm';
import { Tasks } from '../../src/entity/Tasks';
import { Checklists } from '../../src/entity/Checklists';
import randomColorGenerator from '../login/randomColorGenerator';
import { Projects } from '../../src/entity/Projects';
import { Task_comments } from '../../src/entity/Task_comments';
import { Users } from '../../src/entity/Users';
const structuringData = async (part: string, projectId: number) => {
	const foundProject = await Projects.findOne({ where: { id: projectId } });
	const projects = await getRepository(Projects)
		.createQueryBuilder('projects')
		.where('projects.id = :id', { id: projectId })
		.leftJoinAndSelect('projects.partsList', 'partsList', 'partsList.title = :title', { title: part })
		.leftJoinAndSelect('partsList.taskBoxesList', 'taskBoxesList')
		.leftJoinAndSelect('taskBoxesList.tasksList', 'tasksList')
		.leftJoinAndSelect('tasksList.checklistsList', 'checklistsList')
		.leftJoinAndSelect('tasksList.commentsList', 'commentsList')
		.orderBy('taskBoxesList.index', 'ASC')
		.addOrderBy('tasksList.index', 'ASC')
		.addOrderBy('checklistsList.createdAt', 'ASC')
		// .getQuery();
		.getMany();
	console.log(projects);
	const partOne = projects[0].partsList[0];
	let taskBox: any[] = [];
	let taskItems: {
		[index: string]: any;
	} = {};
	// console.log('partOne!', partOne);
	// if (partOne.taskBoxesList.length === 2) {
	// 	[partOne.taskBoxesList[0], partOne.taskBoxesList[1]] = [partOne.taskBoxesList[1], partOne.taskBoxesList[0]];
	// }
	partOne.taskBoxesList.map(el => {
		let tasks: any[] = [];

		el.tasksList.map(el => {
			console.log('adfadfasdfasgasdgasfdf', el);
			tasks.push(Object.keys(taskItems).length);
			taskItems[Object.keys(taskItems).length] = {
				taskTitle: el.title,
				desc: el.desc,
				taskColor: el.taskColor,
				startDate: el.startDate,
				endDate: el.endDate,
				assignees: JSON.parse(el.assignees),
				checkList: el.checklistsList,
				comment: el.commentsList,
				dragging: false,
			};
		});
		taskBox.push(Object.assign({}, { taskBoxTitle: el.title, tasks, dragging: false }));
	});
	console.log(taskItems);
	return { taskBox, taskItems };
};

const socketKanban = async (socket: Socket) => {
	// kanban기능
	const kanbanIo = app.get('kanbanIo');
	const { projectId, userId } = socket.handshake.query;
	const foundProject = await Projects.findOne({ where: { id: projectId } });
	// 💚/kanban#event - 기능
	// socket.on('event', () => {
	// 	console.log('💚/kanban#event-');
	// });
	socket.on('joinPart', async part => {
		console.log(part);
		const foundPartOne = await Parts.findOne({ where: { doingProject: foundProject, title: part } });
		if (!foundPartOne) {
			const foundPart = await Parts.find({ where: { doingProject: foundProject } });
			let maxIndex = -1;
			if (foundPart.length !== 0) {
				maxIndex = foundPart.reduce((acc, cur) => {
					return acc.index > cur.index ? acc : cur;
				}).index;
			}
			const created = await Parts.create({ title: part, doingProject: foundProject, index: maxIndex + 1 });
			created.save();
		}
		socket.join(part);
		kanbanIo.to(socket.id).emit('getKanbanData', await structuringData(part, Number(projectId)));
	});
	socket.on('leavePart', part => {
		socket.leave(part);
	});
	socket.on('taskBoxBlock', ({ targetListIndex, isDragging }) => {
		socket.broadcast.emit('taskBoxBlock', { targetListIndex, isDragging });
	});
	socket.on('taskItemBlock', ({ targetListIndex, targetIndex, isDragging }) => {
		socket.broadcast.emit('taskItemBlock', { targetListIndex, targetIndex, isDragging });
	});

	socket.on('addTaskBox', async ({ index, title, part }) => {
		const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
		const created = await Task_boxes.create({ index, title, groupingPart: foundPart });
		await created.save();
		console.log('adddddd', socket.id);
		socket.broadcast.to(part).emit('addTaskBox', { taskBoxTitle: title, tasks: [] });
	});
	socket.on('addTaskItem', async ({ targetListIndex, part, taskTitle, taskColor }) => {
		const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
		const foundBox = await getRepository(Task_boxes).findOne({
			where: { index: targetListIndex, groupingPart: foundPart },
			relations: ['tasksList'],
		});
		console.log(foundBox?.tasksList);
		let maxIndex = -1;
		if (foundBox?.tasksList.length !== 0) {
			maxIndex = foundBox!.tasksList.reduce((acc, cur) => {
				return cur.index > acc ? cur.index : acc;
			}, 0);
		}

		console.log('max', maxIndex);
		console.log('TLI', targetListIndex);

		const created = await Tasks.create({
			index: maxIndex + 1,
			title: taskTitle,
			desc: '',
			taskColor: taskColor,
			startDate: '',
			endDate: '',
			assignees: JSON.stringify([]),
			groupingBox: foundBox,
		});
		await created.save();
		const tasks = {
			assignees: JSON.parse(created.assignees),
			checkList: [],
			comment: [],
			taskTitle: created.title,
			desc: created.desc,
			taskColor: created.taskColor,
			startDate: created.startDate,
			endDate: created.endDate,
		};
		socket.broadcast.to(part).emit('addTaskItem', {
			targetListIndex,
			task: tasks,
		});
	});
	socket.on('editTaskItem', async ({ task, targetListIndex, targetIndex, part, isDragging }) => {
		console.log('에딧:', task, targetIndex, targetListIndex, part);
		const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
		const foundBox = await Task_boxes.findOne({ where: { index: targetListIndex, groupingPart: foundPart } });
		let found = await Tasks.findOne({ where: { groupingBox: foundBox, index: targetIndex } });
		console.log('찾음', foundBox, found);
		if (found) {
			(found.title = task.taskTitle),
				(found.desc = task.desc),
				(found.startDate = task.startDate),
				(found.endDate = task.endDate),
				(found.assignees = JSON.stringify(task.assignees)),
				await found.save();
		}
		const foundUser = await Users.findOne({ where: { id: userId } });

		const foundChecklist = await Checklists.find({ where: { nowTask: found } });
		foundChecklist.map(el => {
			el.remove();
		});
		for (let i = 0; i < task.checkList.length; i++) {
			const created = await Checklists.create({
				nowTask: found,
				desc: task.checkList[i].desc,
				isChecked: task.checkList[i].isChecked,
			});
			await created.save();
		}

		const foundComment = await Task_comments.find({ where: { nowTask: found } });
		foundComment.map(el => {
			el.remove();
		});
		for (let i = 0; i < task.comment.length; i++) {
			const created = await Task_comments.create({ writer: foundUser, body: task.comment[i].body, nowTask: found });
			await created.save();
		}

		socket.broadcast.emit('editTaskItem', { targetIndex, targetListIndex, task, isDragging });
	});
	socket.on('deleteTaskBox', async ({ targetListIndex, part }) => {
		const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
		const foundBox = await Task_boxes.findOne({ where: { groupingPart: foundPart, index: targetListIndex } });
		await foundBox?.remove();
		//앞당기는 로직
		const found = await Task_boxes.find({ where: { groupingPart: foundPart }, order: { index: 'ASC' } });
		for (let i = 0; i < found.length; i++) {
			if (found[i].index > targetListIndex) {
				found[i].index--;
				await found[i].save();
			}
		}
		socket.broadcast.to(part).emit('deleteTaskBox', targetListIndex);
	});
	socket.on('deleteTaskItem', async ({ targetIndex, targetListIndex, part }) => {
		const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
		const foundBox = await Task_boxes.findOne({ where: { index: targetListIndex, groupingPart: foundPart } });
		console.log(targetIndex, targetListIndex);
		console.log(foundBox);
		const foundTask = await Tasks.findOne({ where: { index: targetIndex, groupingBox: foundBox } });
		console.log(foundTask);
		await foundTask?.remove();
		//앞당기는 로직
		const foundBoxes = await Task_boxes.find({ where: { groupingPart: foundPart }, relations: ['tasksList'] });
		const found = await Tasks.find({ where: { groupingBox: foundBox }, order: { index: 'ASC' } });

		foundBoxes.map(el => {
			el.tasksList.map(el => {
				if (el.index > targetIndex) {
					el.index--;
					el.save();
				}
			});
		});

		socket.broadcast.emit('deleteTaskItem', { targetIndex, targetListIndex });
	});
	socket.on('boxMoving', async ({ currentIndex, targetIndex, part, isDragging }) => {
		// 데이터베이스 저장하고, taskBox,taskItem을 추출해서, 데이터포맷 맞춰서 emit시킨다.
		const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
		const foundBoxes = await Task_boxes.find({ where: { groupingPart: foundPart }, order: { index: 'ASC' } });
		console.log('!!@#!@#', foundPart, foundBoxes);
		if (currentIndex < targetIndex) {
			foundBoxes.map(el => {
				if (el.index === currentIndex) {
					el.index = -1;
					el.save();
				} else if (el.index > currentIndex && el.index <= targetIndex) {
					el.index--;
					el.save();
				}
			});
			foundBoxes[currentIndex].index = targetIndex;
			//오른쪽으로 드래깅했음
		} else {
			foundBoxes.map(el => {
				if (el.index === currentIndex) {
					el.index = -1;
					el.save();
				} else if (el.index < currentIndex && el.index >= targetIndex) {
					el.index++;
					el.save();
				}
			});
			foundBoxes[currentIndex].index = targetIndex;
			//왼쪽으로 드래깅했음
		}
		console.log(structuringData(part, Number(projectId)));
		socket.broadcast.emit('boxMoving', { currentIndex, targetIndex, isDragging });
	});
	socket.on(
		'taskMoving',
		async ({ currentIndex, targetIndex, currentListIndex, targetListIndex, part, isDragging }) => {
			// 데이터베이스 저장하고, taskBox,taskItem을 추출해서, 데이터포맷 맞춰서 emit시킨다.
			const foundPart = await Parts.findOne({ where: { title: part, doingProject: foundProject } });
			console.log(`테스크아이템: ${currentIndex} => ${targetIndex}
		테스크박스 : ${currentListIndex} => ${targetListIndex}`);
			if (currentListIndex === targetListIndex) {
				//taskMoving의 로직
				const foundBox = await Task_boxes.find({
					where: { groupingPart: foundPart, index: currentListIndex },
					relations: ['tasksList'],
				});
				const boxOne = foundBox[0];
				if (currentIndex < targetIndex) {
					//하행
					let temp: any;
					boxOne.tasksList.map(el => {
						if (el.index === currentIndex) {
							el.index = -1;
							temp = el;
						} else if (el.index > currentIndex && el.index <= targetIndex) {
							el.index--;
							el.save();
						}
					});
					temp!.index = targetIndex;
					temp?.save();
					console.log(temp!.index);
				} else {
					//상행
					let temp: any;
					boxOne.tasksList.map(el => {
						console.log(el.index, currentIndex);
						if (el.index === currentIndex) {
							el.index = -1;
							temp = el;
						} else if (el.index < currentIndex && el.index >= targetIndex) {
							el.index++;
							el.save();
						}
					});
					console.log(temp);
					temp!.index = targetIndex;
					temp?.save();
					console.log(temp!.index);
				}
			} else {
				//박스이동 + 테스크이동
				const foundBoxes = await Task_boxes.find({
					where: { groupingPart: foundPart },
					relations: ['tasksList'],
					order: { index: 'ASC' },
				});
				//위에 boxMoving의 로직이 어느정도 들어간다.

				let tempTask: any;
				foundBoxes[currentListIndex].tasksList.map(el => {
					if (el.index === currentIndex) {
						el.index = -1;
						tempTask = el;
					} else if (el.index > currentIndex) {
						el.index--;
						el.save();
					}
				});
				console.log('teeeeee', tempTask);
				tempTask!.groupingBox = foundBoxes[targetListIndex];

				foundBoxes[targetListIndex].tasksList.map(el => {
					if (el.index >= targetIndex) {
						el.index++;
						el.save();
					}
				});
				tempTask!.index = targetIndex;
				tempTask?.save();
			}
			socket.broadcast.emit('taskMoving', { targetListIndex, targetIndex, currentIndex, currentListIndex, isDragging });
		},
	);
	socket.on('moving', taskList => {
		kanbanIo.emit('moving', taskList);
	});
};
export default socketKanban;
