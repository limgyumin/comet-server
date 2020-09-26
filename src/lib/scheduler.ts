import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as schedule from "node-schedule";

import getAPI from "./githubAPI/getAPI";
import UserInfoType from "../types/UserInfo";

//"0 0 10,12,14,16,18,20 * * *"
export default () => {
  console.log("[Schedule] Run at a specific time");
  schedule.scheduleJob("0 0 8,10,12,14,16,18,20 * * *", async () => {
    console.log("\n[Schedule] Start");
    try {
      const userRepo = getRepository(User);
      const rowCount: number = await userRepo.count();
      let userInfo: UserInfoType;

      if (rowCount === 0) {
        console.log("[Typeorm] Empty DB Detected. Exit.");
        return;
      } else {
        const userData = await userRepo.find();
        userData.map(async (user, index) => {
          try {
            userInfo = await getAPI(user.user_id);

            user.user_id = userInfo.id;
            user.profile = userInfo.profile;
            user.bio = userInfo.bio;
            user.total_commit = userInfo.total;
            user.today_commit = userInfo.today;
            user.week_commit = userInfo.week;
            user.week_avg = userInfo.weekAvg;

            await userRepo.save(user);
            console.log(
              `[Typeorm] Successfully updated [${user.user_id}]: ${user.today_commit}`
            );

            if (userInfo.today === 0) {
              console.log(`[GitHubAPI] 0 Contribution: [${user.user_id}]`);
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  });
};
