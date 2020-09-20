import { getRepository } from "typeorm";
import { User } from "../entity/User";
import calContributions from "../lib/contributions/calContributions";

export default async (data) => {
  const contributions = calContributions(data);
  const userRepo = getRepository(User);

  let user = await userRepo.findOne({ user_id: data.user.login });
  if (!user) {
    user = new User();
  }

  user.user_id = data.user.login;
  user.profile = data.user.avatarUrl;
  user.bio = data.user.bio;
  user.total_commit = contributions.total;
  user.today_commit = contributions.today;
  user.week_commit = contributions.week;
  user.week_avg = contributions.weekAvg;

  return userRepo.save(user);
};
