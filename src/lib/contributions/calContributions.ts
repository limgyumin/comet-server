import UserDataType from "../../types/UserData";

export default (data: UserDataType) => {
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

  let todayContributions: number = 0;

  weeks.map((week, index) => {
    if (index === weeks.length - 1) {
      week.contributionDays.map((day, index2) => {
        if (index2 === week.contributionDays.length - 1) {
          todayContributions = day.contributionCount;
        }
      });
    }
  });

  let weekContributions: number = 0;
  let weekIdx: number = 0;

  weeks.map((week, index) => {
    if (index === weeks.length - 1) {
      week.contributionDays.map((day, index2) => {
        weekContributions += day.contributionCount;
        weekIdx = index2 + 1;
      });
    }
  });

  const contributions = {
    total: totalContributions,
    today: todayContributions,
    week: weekContributions,
    weekAvg: Math.ceil(weekContributions / weekIdx),
  };

  return contributions;
};
