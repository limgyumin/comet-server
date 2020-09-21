import * as schedule from "node-schedule";

export default async () => {
  console.log("[Schedule] Run at a specific time");
  schedule.scheduleJob("0 * * * * *", () => {
    console.log("Schedule Executed");
  });
};
