import { getRepository } from "typeorm";
import { User } from "../entity/User";
import UserInfoType from "../types/UserInfo";

export default async (userInfo: UserInfoType) => {
  const userRepo = getRepository(User);
  const user = new User();

  user.name = userInfo.name;
  user.user_id = userInfo.id;
  user.profile = userInfo.profile;
  user.bio = userInfo.bio;
  user.total_commit = userInfo.total;
  user.today_commit = userInfo.today;
  user.week_commit = userInfo.week;
  user.week_avg = userInfo.weekAvg;

  return userRepo.save(user);
};
