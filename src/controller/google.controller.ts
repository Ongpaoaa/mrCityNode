import { Request, Response } from "express";
import * as googleService from "@/service/google.service";
import * as userService from "@/service/user.service";
import * as sessionService from "@/service/session.service";
import { UserLogin } from "@/lib/prisma";

export const getAuthUrl = async (req: Request, res: Response) => {
  const authUrl = googleService.getUrl();
  return res.status(200).send({ url: authUrl });
};

export const googleCallBack = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const profile = await googleService.getProfile(code);

  let user = await userService.findUserByEmail(profile.email);
  if (!user) {
    user = await userService.Create(profile);
  }
  await UserLogin.create({
    data:{
      userId: user.id,
      time: new Date()
    }
  });
  const session = await sessionService.Create(user.id);
  //return res.status(200).send({ session: session });
  return res.redirect(`mrcity://redirect?session=${session}`);
};
