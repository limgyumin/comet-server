import { Request, Response } from "express";

import { getRepository } from "typeorm";
import { User } from "../../../../entity/User";

import getAPI from "../../../../lib/githubAPI/getAPI";
import calContributions from "../../../../lib/contributions/calContributions";

export default async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const data = await getAPI(body.userId).catch((err) => {
      return res.status(404).json({
        status: 404,
        message: "존재하지 않는 아이디.",
      });
    });

    const contributions = calContributions(data);

    const userRepo = getRepository(User);
    const user: User = new User();

    user.user_id = data.user.login;
    user.profile = data.user.avatarUrl;
    user.bio = data.user.bio;
    user.total_commit = contributions.total;
    user.today_commit = contributions.today;
    user.week_commit = contributions.week;
    user.week_avg = contributions.weekAvg;

    await userRepo.save(user);

    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: {
        total: contributions.total,
        today: contributions.today,
        week: contributions.week,
        weekAvg: contributions.weekAvg,
      },
    });
  } catch (error) {
    console.log("서버 오류", error.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
