import { Request, Response } from "express";
import getAPI from "../../../../lib/getAPI";
import calContributions from "../../../../lib/calContributions";
import { getRepository } from "typeorm";
import { User } from "../../../../entity/User";

export default async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const data = await getAPI(body.userId).catch((err) => {
      return res.status(404).json({
        status: 404,
        message: "존재하지 않는 아이디.",
      });
    });

    const userInfo = {
      user: {
        userId: data.user.login,
        profile: data.user.avatarUrl,
        bio: data.user.bio,
      },
      contributions: calContributions(data),
    };

    const userRepo = getRepository(User);
    const user: User = new User();

    user.user_id = body.userId;
    user.profile = userInfo.user.profile;
    user.bio = userInfo.user.bio;
    console.log(userInfo.user.bio);
    user.total_commit = userInfo.contributions.total;
    user.today_commit = userInfo.contributions.today;
    user.week_commit = userInfo.contributions.week;
    user.week_avg = userInfo.contributions.weekAvg;

    await userRepo.save(user);

    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: userInfo,
    });
  } catch (error) {
    console.log("서버 오류", error.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
