import "dotenv/config";
import { GraphQLClient, gql } from "graphql-request";

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

  const data = await graphQLClient.request(query);
  return data;
};
