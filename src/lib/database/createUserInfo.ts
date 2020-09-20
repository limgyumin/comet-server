import calContributions from "../../lib/contributions/calContributions";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";

interface ContributionDaysType {
  contributionCount: number;
  date: Date;
  weekday: number;
}

interface WeeksType {
  contributionDays: Array<ContributionDaysType>;
}

interface DataType {
  user: {
    login: string;
    avatarUrl: string;
    bio: string;
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<WeeksType>;
      };
    };
  };
}

export default async (data: DataType) => {
  const userRepo = getRepository(User);
  const user: User = new User();

  const contributions = calContributions(data);

  user.user_id = data.user.login;
  user.profile = data.user.avatarUrl;
  user.bio = data.user.bio;
  user.total_commit = contributions.total;
  user.today_commit = contributions.today;
  user.week_commit = contributions.week;
  user.week_avg = contributions.weekAvg;

  await userRepo.save(user);
};
