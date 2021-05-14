import { Users } from '../src/entity/Users';
import { createConnections } from 'typeorm';
import { career_job, career_office, last_name, name } from './d_profile';
import { Recruits } from '../src/entity/Recruits';
import axios from 'axios';
import { detail_desc } from './d_recruit';
import { Recruit_comments } from 'src/entity/Recruit_comments';
import { match } from 'assert/strict';

createConnections()
	.then(async connection => {
		console.log('DB 연결 완료! ');
		dummyCreate();
	})
	.catch(error => console.log(error));

const dummyCreate = async () => {
	// 랜덤 유저 생성
	const users = await Users.find();
	console.log(users);
	const user = await Users.findOne({ where: { id: Math.floor(Math.random() * users.length + 1) } });
	// 랜덤유저로 프로필 편집
	if (user) {
		user.career = JSON.stringify([
			career_office[Math.floor(Math.random() * career_office.length)],
			career_job[Math.floor(Math.random() * career_job.length)],
			Math.floor(Math.random() * 10 + 1),
		]);
		user.name =
			last_name[Math.floor(Math.random() * last_name.length)] +
			name[Math.floor(Math.random() * name.length)] +
			name[Math.floor(Math.random() * name.length)];
		user.isOpen = Boolean(Math.round(Math.random()));
		user.save();
	}
	// 랜덤유저로 리크루트 쓰기
	const data = await axios.get(
		`https://www.beginmate.com/api/recruit/list?page=${Math.floor(Math.random() * 20 + 1)}`,
		{
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'user-agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
			},
		},
	);
	const picked = data.data.recruitList[Math.floor(Math.random() * data.data.recruitList.length)];
	const created = await Recruits.create({
		name: picked.teamName,
		simple_desc: picked.teamSimpleDesc,
		recruit_members: JSON.stringify([
			picked.recruitField,
			`${Math.floor(Math.random() * 10 + 1)}년`,
			`${Math.floor(Math.random() * 5 + 1)}명`,
			`${Math.floor(Math.random() * 14 + 1)}일`,
		]),
		service_step: picked.serviceStep,
		period: `${Math.floor(Math.random() * 12 + 1)}개월`,
		detail_title: picked.teamName,
		detail_desc: makeDesc(),
		// writer:user
	});
	created.save();

	for (let i = 0; i < 10; i++) {
		// 댓글은 10번 반복
		// 랜덤 리크루트 찾기
		const foundRecruits = await Recruits.find();
		const pickedId = foundRecruits[Math.floor(Math.random() * foundRecruits.length)].id;
		const pickedRecruits = await Recruits.findOne({ where: { id: pickedId } });
		// 랜덤 리크루트에 댓글 달기
		Recruit_comments.create({
			writer: user!.name,
			writer_id: user!.id,
			body: makeComment(),
			recruits: pickedRecruits,
		});
	}

	// 결과정리
	// 랜덤 유저 선택(이미존재하는)
	// 유저의 프로필변경 1회
	// 리크루트 게시글 1회 작성
	// 랜덤 리크루트에 댓글 10회작성
};

const makeDesc = () => {
	const splited = detail_desc[Math.round(Math.random())].split(' ');
	let added = '';
	for (let i = 0; i < 100; i++) {
		added += splited[Math.floor(Math.random() * splited.length)];
		added += ' ';
	}
	return added;
};

const makeComment = () => {
	const head = [
		'잘봤습니다',
		'감사합니다',
		'좋은글이네요',
		'멋집니다',
		'제생각에',
		'오오 대박',
		'최고에요',
		'존경합니다',
		'리스펙합니다',
		'좋은아이디어네요',
		'지원합니다',
		'참가합니다',
		'고마워',
	];
	const mid = [
		'인상적인',
		'감동적인',
		'재밌는',
		'눈감아도 생각나는',
		'떠오르는',
		'획기적인',
		'창조적인',
		'언젠가 성공할',
		'성공적인',
		'떡상각나오는',
		'최고의',
		'별로긴한데',
	];
	const foot = [
		'아이디어네요',
		'아이디어군요',
		'아이디어입니다',
		'생각이네요',
		'생각이군요',
		'생각입니다',
		'프로젝트군요',
		'프로젝트네요',
		'프로젝트입니다',
		'레시피군요',
		'레시피네요',
		'레시피입니다',
	];
	let comment = '';
	comment += head[Math.floor(Math.random() * head.length)] + ' ';
	comment += mid[Math.floor(Math.random() * mid.length)] + ' ';
	comment += foot[Math.floor(Math.random() * foot.length)];
	return comment;
};
