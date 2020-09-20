import { Request, Response } from "express";

import getAPI from "../../../../lib/githubAPI/getAPI";
import calContributions from "../../../../lib/contributions/calContributions";
import createUserInfo from "../../../../lib/database/createUserInfo";

export default async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const data = await getAPI(body.userId).catch((err) => {
      return res.status(404).json({
        status: 404,
        message: "존재하지 않는 아이디.",
      });
    });

    const contributions = calContributions(data);
    createUserInfo(data, contributions);

    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: {},
    });
  } catch (error) {
    console.log("서버 오류", error.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
