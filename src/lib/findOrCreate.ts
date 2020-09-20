import { getRepository } from "typeorm";
import { User } from "../entity/User";

export default async (userInfo) => {
  const userRepo = getRepository(User);

  let user = await userRepo.findOne({ user_id: userInfo.id });
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
