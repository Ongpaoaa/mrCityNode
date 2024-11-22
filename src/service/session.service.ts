import crypto from "crypto";
import { Session } from "@/lib/prisma";

export const Create = async (userId: string) => {
  const now = new Date();
  const time = now.getTime();
  const expireTime = time + 1000 * 3600 * 24 * 30; // 30 days
  now.setTime(expireTime);

  const session = await Session.create({
    data: {
      userId: userId,
      expiresAt: now.toISOString(),
    },
  });

  const signId = Sign(session.id);
  return signId;
};

export const Sign = (id: string) => {
  const signId = crypto
    .createHmac("sha256", process.env.SESSION_SECRET || "session-secret")
    .update(id)
    .digest("hex");
  const id64 = Buffer.from(id).toString("base64url");
  return id64 + "-" + signId;
};

export const UnSign = (ssid: string) => {
  const arr = ssid.split("-");
  const id = Buffer.from(arr[0], "base64url").toString("ascii");
  const signId = Sign(id);

  if (ssid !== signId) {
    return null;
  }

  return id;
};

export const Validate = async (ssid: string) => {
  const id = UnSign(ssid);
  if (!id) {
    console.log("Session MisMatch");
    return null;
  }

  const session = await Session.findUnique({ where: { id: id } });
  if (!session) {
    return null;
  }

  const now = new Date();
  console.log(session)
  if (session.expiresAt < now) {
    console.log("Session Expired");
    await Session.delete({
      where: {
        id: id,
      },
    });
    return null;
  }

  return session;
};

export const Delete = async (id: string) => {
  await Session.delete({
    where: {
      id: id,
    },
  });
};
