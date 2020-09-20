import client from "./connectAPI";
import gql from "graphql-tag";

export default async (userId: string) => {
  const { loading, errors, data } = await client.query({
    query: gql`
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
          }
        `,
  });

  return data;
};
