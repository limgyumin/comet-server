import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as schedule from "node-schedule";

import getAPI from "./githubAPI/getAPI";
import UserInfoType from "../types/UserInfo";

//매일 8, 10, 12, 14, 16, 18, 20시에 갱신돼요.
export default () => {
  console.log("[Schedule] Run at a specific time");
  schedule.scheduleJob("0 0 8,10,12,14,16,18,20 * * *", async () => {
    console.log("\n[Schedule] Start");
    try {
      const userRepo = getRepository(User);
      //db Row의 수를 계산해요
      const rowCount: number = await userRepo.count();
      let userInfo: UserInfoType;

      //Row의 수가 0이면 갱신을 하지 않아요.
      if (rowCount === 0) {
        console.log("[Typeorm] Empty DB Detected. Exit.");
        return;
      } else {
        //db에서 confirm Column이 true인 것들만 가져와요.
        const userData = await userRepo.find({ confirm: true });
        //가져온 row에 갱신된 데이터를 담아요.
        userData.map(async (user, index) => {
          try {
            try {
              userInfo = await getAPI(user.user_id);
            } catch (error) {
              console.log("[GitHubAPI] 머하는 놈이지..");
              userRepo.remove(user);
            }

            user.user_id = userInfo.id;
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
