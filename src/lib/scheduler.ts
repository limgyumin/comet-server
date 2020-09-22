import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as schedule from "node-schedule";

import UserDataType from "../types/UserData";
import getAPI from "./githubAPI/getAPI";
import calContributions from "./contributions/calContributions";

//"0 0 10,12,14,16,18,20 * * *"
export default () => {
  console.log("[Schedule] Run at a specific time");
  schedule.scheduleJob("0 * * * * *", async () => {
    console.log("[Schedule] Start");
    try {
      const userRepo = getRepository(User);
      const rowCount: number = await userRepo.count();
      let data: UserDataType;

      if (rowCount === 0) {
        console.log("[Typeorm] Empty DB Detected. Exit.");
        return;
      } else {
        const userData = await userRepo.find();
        userData.map(async (user, index) => {
          //row에 존재하는 userId 값이 유효하지 않으면 에러처리 해줘야함.
          data = await getAPI(user.user_id).catch((err) => {});
          const contributions = calContributions(data);

          user.user_id = data.user.login.toLowerCase();
          user.profile = data.user.avatarUrl;
          user.bio = data.user.bio;
          user.total_commit = contributions.total;
          user.today_commit = contributions.today;
          user.week_commit = contributions.week;
          user.week_avg = contributions.weekAvg;

          userRepo.save(user);
          console.log(
            `[Typeorm] Successfully updated [${user.user_id}]: ${user.today_commit}`
          );

          // if (contributions.today === 0) {
          //   console.log(`[GitHubAPI] 0 Contribution: [${user.user_id}]`);
          // }
        });
      }
    } catch (error) {
      console.log("[GitHubAPI] ", error.message);
    }
  });
};
