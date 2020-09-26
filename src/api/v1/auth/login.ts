import "dotenv/config";
import { Request, Response } from "express";
import axios from "axios";

export default async (req: Request, res: Response) => {
  type RequestBody = {
    code: string;
  };

  const { code }: RequestBody = req.body;
  console.log(code);

  try {
    let response;
    try {
      response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          code,
          client_id: process.env.CLIENT_ID, // 내 APP의 정보
          client_secret: process.env.CLIENT_SECRET, // 내 APP의 정보
        },
        {
          headers: {
            accept: "application/json",
          },
        }
      );
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "검증되지 않은 코드",
      });
    }

    console.log(response);
    const token = response.data.access_token;
    const { data } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    res.status(200).json({
      status: 200,
      message: "유저 정보 조회 성공.",
      data,
    });
  } catch (error) {
    console.log("서버 오류", error);
    return res.status(500).json({
      status: 500,
      message: "서버 오류.",
    });
  }
};
