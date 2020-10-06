import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as schedule from "node-schedule";

import getAPI from "./githubAPI/getAPI";
import UserInfoType from "../types/UserInfo";
import logger from "./logger";

//매일 8, 10, 12, 14, 16, 18, 20시에 갱신돼요.
export default () => {
  schedule.scheduleJob("0 0 8,10,12,14,16,18,20,22 * * *", async () => {
    logger.gray("GitHub 정보 갱신 시작.");
    try {
      const userRepo = getRepository(User);
      //db Row의 수를 계산해요
      const rowCount: number = await userRepo.count();
      let userInfo: UserInfoType;

      //Row의 수가 0이면 갱신을 하지 않아요.
      if (rowCount) {
        //db에서 confirm Column이 true인 것들만 가져와요.
        const users: User[] = await userRepo.find({ confirm: true });
        //가져온 row에 갱신된 데이터를 담아요.
        users.map(async (user, index) => {
          try {
            userInfo = await getAPI(user.user_id);
          } catch (error) {
            logger.red(`갱신 실패. [${user.user_id}]`);
            userRepo.remove(user);
            return error;
          }

          //새로 갱신될 데이터들이에요.
          user.bio = userInfo.bio;
          user.total_commit = userInfo.total;
          user.today_change = userInfo.today - user.today_commit;
          user.today_commit = userInfo.today;
          user.week_commit = userInfo.week;
          user.week_avg = userInfo.weekAvg;

          await userRepo.save(user);
          logger.green(`갱신 성공. [${user.user_id}]: ${user.today_commit}`);
        });
      }
    } catch (err) {
      logger.red("갱신 오류.", err.message);
    }
  });
};
