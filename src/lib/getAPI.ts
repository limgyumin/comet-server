import client from "./connectAPI";
import gql from "graphql-tag";

exports.getAPI = async () => {
  const userId = "limgyumin";
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

  console.log("loading:", loading);
  console.log("error:", errors);
  console.log("data:", data);
};
