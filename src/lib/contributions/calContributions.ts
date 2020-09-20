import ContributionType from "../../types/Contributions";

export default (data: ContributionType) => {
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

  let weekCount: number = 0;
  let weekIdx: number = 0;

  weeks.map((week, index) => {
    if (index === weeks.length - 1) {
      week.contributionDays.map((day, index2) => {
        weekCount += day.contributionCount;
        weekIdx = index2 + 1;
      });
    }
  });

  const contributions = {
    total: totalContributions,
    today: todayCount,
    week: weekCount,
    weekAvg: weekCount / weekIdx,
  };

  console.log(contributions);
  return contributions;
};
