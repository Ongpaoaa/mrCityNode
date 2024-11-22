import { oauth2Client } from "@/lib/google";
import type { GoogleProfile } from "@/types/google";
import axios from "axios";

export const getUrl = () => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    include_granted_scopes: true,
  });
  return authorizationUrl;
};

export const getProfile = async (code: string) => {
  if (!code) {
    throw new Error("cannot get code");
  }

  const { tokens } = await oauth2Client.getToken(code);

  const response = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } }
  );
  if (response.status === 200) {
    return response.data as GoogleProfile;
  } else {
    console.log(response);
    throw new Error("cannot get profile");
  }
};
