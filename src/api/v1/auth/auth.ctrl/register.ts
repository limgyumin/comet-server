import { Request, Response } from "express";
import getAPI from "../../../../lib/getAPI";
import calContributions from "../../../../lib/calContributions";

export default async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const data = await getAPI(body.userId).catch((err) => {
      return res.status(404).json({
        status: 404,
        message: "존재하지 않는 아이디.",
      });
    });

    const userInfo = {
      user: {
        userId: data.user.login,
        profile: data.user.avatarUrl,
        bio: data.user.bio,
      },
      contributions: calContributions(data),
    };

    res.status(200).json({
      status: 200,
      message: "조회 성공.",
      data: userInfo,
    });
  } catch (error) {
    console.log("서버 오류", error.message);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
