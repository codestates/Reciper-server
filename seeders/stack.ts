import axios from 'axios';
import { Stacks } from '../src/entity/Stacks';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

createConnection()
	.then(async connection => {
		console.log('DB 연결 완료! ');
		updateStacks();
	})
	.catch(error => console.log(error));

console.log('Stacks DB update loading...');
const updateStacks = async () => {
	const atoz = 'abcdefghijklmnopqrstuvwxyz';

	// const res = await Stacks.create({ name: 'test' });
	// res.save();
	// console.log(res);
	for (let i = 0; i < atoz.length; i++) {
		console.log(`start for [${i}]`);
		const res: any = await axios.get(`https://programmers.co.kr/tags/auto_complete?term=${atoz[i]}`, {
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'user-agent':
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
			},
		});
		for (let j = 0; j < res.data.results.length; j++) {
			const item = res.data.results[j];
			console.log(item);
			const found = await Stacks.findOne({ where: { name: item.text } });
			if (found) {
				continue;
			} else {
				if (item.length <= 15) {
					const created = await Stacks.create({ name: item.text });
					created.save();
					console.log(`Add ${item.text}`);
				}
				console.log('15 character over');
			}
		}
	}
	console.log('db update  done');
	return;
};
