import { NextFunction, Request, Response } from "express";
import * as sessionService from "@/service/session.service";
import { LoginType } from "@prisma/client";
import { User } from "@/lib/prisma";
import * as userService from "@/service/user.service";

export const authAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ssid = req.headers.session as string;
  // const email = req.headers.email as string;
  // const loginType = req.headers.loginType as LoginType;

  if (!ssid) 
  {
    return res.status(403).send({
      message: "No Token provided!",
    });
  }
  

  const session = await sessionService.Validate(ssid);
  if (!session) {
    return res.status(401).send({
      message: "Unauthorized!",
    });
  }
  const user = await userService.findUserByID(session.userId);
  if(user != null && user.admin === true)
  {
    next();
  }
  else
  {
    return res.status(401).send({
        message: "User not admin",
    })
  }
  
};
