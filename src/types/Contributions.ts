interface ContributionDaysType {
  contributionCount: number;
  date: Date;
  weekday: number;
}

interface WeeksType {
  contributionDays: Array<ContributionDaysType>;
}

export default interface ContributionType {
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
