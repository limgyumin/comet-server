import "dotenv/config";
import { GraphQLClient, gql } from "graphql-request";

export default async (userId: string) => {
  const endpoint = "https://api.github.com/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const query = gql`
  {
    user(login: "${userId}") {
      login
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

  try {
    const data = await graphQLClient.request(query);
    console.log(
      data.user.login,
      data.user.contributionsCollection.contributionCalendar.totalContributions
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
