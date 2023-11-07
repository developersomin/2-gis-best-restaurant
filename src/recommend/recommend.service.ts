import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Webhook, MessageBuilder } from 'discord-webhook-node';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RecommendService {
	constructor(
		private readonly usersService: UsersService,
		private readonly restaurantsService: RestaurantsService,
	) {}

	//11:30 자동 실행
	@Cron('0 30 11 * * *')
	async recommendRes() {
		const users = await this.usersService.findUsers();
		const recommendUsers = users.filter((user) => user.isRecommend);
		const recommendRes = await Promise.all(
			recommendUsers.map(async (user) => {
				return {
					userId: user.nickname,
					restaurants: await this.restaurantsService.recommendRandomRes(user),
				};
			}),
		);
		this.connectAndSend(recommendRes);
	}

	connectAndSend(recommendRes) {
		try {
			const hook = new Webhook(process.env.DISCORD_WEB_HOOK);
			hook.setUsername('점심봇');
			for (const user of recommendRes) {
				const { userId, restaurants } = user;
				const embed = new MessageBuilder().setTitle(`${userId}님 점심 추천 해드릴께요!!`);
				for (const res of restaurants) {
					const { resName, lotNoAddr, foodTypeName, scoreAvg } = res;
					embed.addField(`${resName}`, `주소: ${lotNoAddr}\n카테고리: ${foodTypeName}\n평점: ${scoreAvg}\n`);
				}
				embed.setFooter('다들 맛점 하십시오!!');

				hook.send(embed);
			}
		} catch (e) {
			throw new BadRequestException('디스코드 웹훅 연결중 오류 발생 ');
		}
	}
}
