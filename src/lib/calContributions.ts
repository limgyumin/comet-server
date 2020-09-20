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

export default (data: DataType) => {
  const {
    contributionsCollection: {
      contributionCalendar: { weeks },
    },
  } = data.user;

  const {
    contributionsCollection: {
      contributionCalendar: { totalContributions },
    },
  } = data.user;

  let todayCount: number = 0;

  weeks.map((week, index) => {
    if (index === weeks.length - 1) {
      week.contributionDays.map((day, index2) => {
        if (index2 === week.contributionDays.length - 1) {
          todayCount = day.contributionCount;
        }
      });
    }
  });

  let commitCount: number = 0;

  weeks.map((week, index) => {
    if (index === weeks.length - 1) {
      week.contributionDays.map((day) => {
        commitCount += day.contributionCount;
      });
    }
  });

  const contributions = {
    total: totalContributions,
    today: todayCount,
    week: commitCount,
  };

  return contributions;
};
