import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as schedule from "node-schedule";

import getAPI from "./githubAPI/getAPI";

export default () => {
  console.log("[Schedule] Run at a specific time");
  schedule.scheduleJob("0 0 12,16,20 * * *", async () => {
    try {
      const userRepo = getRepository(User);
      const count: number = await userRepo.count();

      if (count === 0) {
        console.log("[GitHubAPI] Empty DB Detected. Exit.");
        return;
      }
    } catch (error) {
      console.log("[GitHubAPI] :", error.message);
    }
  });
};
