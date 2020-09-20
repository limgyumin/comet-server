import { Request, Response } from "express";
import getAPI from "../../../../lib/getAPI";

export default async (req: Request, res: Response) => {
  const { body } = req;
  const data = await getAPI(body.userId);

  try {
    if (data.user === null) {
      return res.status(404).json({
        status: 404,
        message: "존재하지 않는 아이디.",
      });
    }

    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
