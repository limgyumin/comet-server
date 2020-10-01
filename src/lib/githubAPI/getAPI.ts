import "dotenv/config";
import { GraphQLClient, gql } from "graphql-request";
import UserDataType from "../../types/UserData";
import UserInfoType from "../../types/UserInfo";
import calContributions from "../contributions/calContributions";

export default async (userId: string) => {
  const endpoint = process.env.GITHUB_API_URL;

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const query = gql`
  {
    user(login: "${userId}") {
      login
      name
      avatarUrl
      bio
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }`;

  const data: UserDataType = await graphQLClient.request(query);

  //data 내의 contributions를 계산하기 위한 함수에요.
  const contributions = calContributions(data);

  //db에 저장을 해야하기 때문에
  //userInfo에 새로 얻은 데이터를 담아요.
  const userInfo: UserInfoType = {
    name: data.user.name,
    id: userId.toLowerCase(),
    profile: data.user.avatarUrl,
    bio: data.user.bio,
    total: contributions.total,
    today: contributions.today,
    todayChange: 0,
    week: contributions.week,
    weekAvg: contributions.weekAvg,
    confirm: false,
    message: "new",
  };

  return userInfo;
};
