import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../../../entity/User";
import UserInfoType from "../../../../types/UserInfo";
import UserDataType from "../../../../types/UserData";

import getAPI from "../../../../lib/githubAPI/getAPI";
import findOrCreate from "../../../../lib/findOrCreate";
import calContributions from "../../../../lib/contributions/calContributions";

interface BodyType {
  userId: string;
}

export default async (req: Request, res: Response) => {
  const { userId }: BodyType = req.body;

  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ user_id: userId.toLowerCase() });
    let data: UserDataType;
    let userInfo: UserInfoType;

    //request user가 없으면 새로 조회,
    //이미 있으면 db에 저장된 데이터를 보여줘요.
    if (!user) {
      try {
        data = await getAPI(userId);
      } catch (err) {
        return res.status(404).json({
          status: 404,
          message: "존재하지 않는 아이디.",
        });
      }
      const contributions = calContributions(data);
      //db에 저장을 해야하기 때문에
      //userInfo에 새로 얻은 데이터를 담아요.
      userInfo = {
        id: userId.toLowerCase(),
        profile: data.user.avatarUrl,
        bio: data.user.bio,
        total: contributions.total,
        today: contributions.today,
        week: contributions.week,
        weekAvg: contributions.weekAvg,
        message: "처음 조회된 유저 정보.",
      };
    } else {
      //userInfo에 db에 저장된 데이터를 담아요.
      userInfo = {
        id: user.user_id,
        profile: user.profile,
        bio: user.bio,
        total: user.total_commit,
        today: user.today_commit,
        week: user.week_commit,
        weekAvg: user.week_avg,
        message: "재 조회된 유저 정보.",
      };
    }

    findOrCreate(userInfo);

    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: userInfo,
    });
  } catch (error) {
    console.log("서버 오류", error);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
