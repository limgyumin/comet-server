import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../../entity/User";
import getAPI from "../../../lib/githubAPI/getAPI";
import UserInfoType from "../../../types/UserInfo";
import logger from "../../../lib/logger";

export default async (req: Request, res: Response) => {
  type RequestBody = {
    username: string;
    userId: string;
  };

  const { username, userId }: RequestBody = req.body;

  try {
    const userRepo = getRepository(User);
    const user: User = await userRepo.findOne({
      user_id: userId.toLowerCase(),
    });

    let userInfo: UserInfoType;
    //request user가 없으면 새로 조회,
    //이미 있으면 db에 저장된 데이터를 보여줘요.
    if (user) {
      userInfo = {
        id: user.user_id,
        name: user.name,
        profile: user.profile,
        bio: user.bio,
        total: user.total_commit,
        today: user.today_commit,
        todayChange: user.today_change,
        week: user.week_commit,
        weekAvg: user.week_avg,
        confirm: user.confirm,
        message: "exist",
      };
    } else {
      //userInfo에 db에 저장된 데이터를 담아요.
      try {
        userInfo = await getAPI(userId);
      } catch (err) {
        logger.yellow("존재하지 않는 아이디.");
        return res.status(404).json({
          status: 404,
          message: "존재하지 않는 아이디.",
        });
      }

      //유저 네임이 입력되었으면 userInfo에 name을 꼭 넣는다.
      //userInfo의 name이 null이면 name에 id를 넣는다.

      userInfo["name"] = username.length === 0 ? username : userInfo["id"];

      const user = new User();
      user.user_id = userInfo.id;
      user.name = userInfo.name;
      user.profile = userInfo.profile;
      user.bio = userInfo.bio;
      user.total_commit = userInfo.total;
      user.today_commit = userInfo.today;
      user.today_change = userInfo.todayChange;
      user.week_commit = userInfo.week;
      user.confirm = userInfo.confirm;
      user.week_avg = userInfo.weekAvg;

      await userRepo.save(user);
    }

    //response로 새로 조회면 새 정보를, 재 조회면 db의
    //정보를 보여줘요.
    logger.green("유저 조회 성공.");
    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: userInfo,
    });
  } catch (err) {
    logger.red("유저 조회 서버 오류", err.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
