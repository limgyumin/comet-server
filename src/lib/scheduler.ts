import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as schedule from "node-schedule";

import getAPI from "./githubAPI/getAPI";

//"0 0 10,12,14,16,18,20 * * *"

export default () => {
  console.log("[Schedule] Run at a specific time");
  schedule.scheduleJob("* * * * * *", async () => {
    try {
      const userRepo = getRepository(User);
      const rowCount: number = await userRepo.count();

      if (rowCount === 0) {
        console.log("[GitHubAPI] Empty DB Detected. Exit.");
        return;
      } else {
        let userArray: Array<string> = [];
        const userData = await userRepo.find();
        userData.map((data, index) => {
          userArray.push(data.user_id);
        });
        console.log(userArray);
      }
    } catch (error) {
      console.log("[GitHubAPI] :", error.message);
    }
  });
};
