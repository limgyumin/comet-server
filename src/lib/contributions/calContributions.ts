import UserDataType from "../../types/UserData";

export default (data: UserDataType) => {
  //주간 GitHub Data
  const {
    contributionsCollection: {
      contributionCalendar: { weeks },
    },
  } = data.user;

  //전체 커밋 수
  const {
    contributionsCollection: {
      contributionCalendar: { totalContributions },
    },
  } = data.user;

  //당일 커밋 수 계산
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

  //주간 커밋 수 계산
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

  //계산한 커밋 수를 Object에 담아서 return 해줘요.
  const contributions = {
    total: totalContributions,
    today: todayContributions,
    week: weekContributions,
    weekAvg: Math.ceil(weekContributions / weekIdx),
  };

  return contributions;
};
