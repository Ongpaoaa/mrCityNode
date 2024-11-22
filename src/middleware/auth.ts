import { NextFunction, Request, Response } from "express";
import * as sessionService from "@/service/session.service";
import { LoginType } from "@prisma/client";
import { User } from "@/lib/prisma";

export const authMiddleware = async (
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

  // if(!email && !loginType)
  //   return res.status(404).send({ message: "No Email and Login type" });

  // const user = await User.findFirst({
  //   where: {
  //     email : email,
  //     loginType : loginType
  //   }
  // })
  // console.log(user);
  // if(user)
  //   req.userId = user.id;
  
  req.userId = session.userId;

  next();
};
