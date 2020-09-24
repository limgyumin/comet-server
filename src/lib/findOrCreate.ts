import { getRepository } from "typeorm";
import { User } from "../entity/User";
import UserInfoType from "../types/UserInfo";

export default async (userInfo: UserInfoType) => {
  const userRepo = getRepository(User);

  //파라미터로 받은 userInfo의 id가 db의 user_id와
  //일치하는 Row를 찾아요.
  let user = await userRepo.findOne({ user_id: userInfo.id });
  //없으면 새로운 user를 생성해요.
  if (!user) {
    user = new User();
  }

  user.user_id = userInfo.id;
  user.profile = userInfo.profile;
  user.bio = userInfo.bio;
  user.total_commit = userInfo.total;
  user.today_commit = userInfo.today;
  user.week_commit = userInfo.week;
  user.week_avg = userInfo.weekAvg;

  return userRepo.save(user);
};
