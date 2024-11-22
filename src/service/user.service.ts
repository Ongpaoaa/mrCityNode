import { User, UserItem } from "@/lib/prisma";
import type { GoogleProfile } from "@/types/google";
import { createUserLeaderBoard } from "./board.service";
import { isExpired, deleteUserItem } from "./item.service";
import { inventory } from "@/routes/inventory.route";
import { LoginType } from "@prisma/client";

export const findUserByEmail = async (email: string) => {
  const user = await User.findUnique({ where: { email: email } });
  return user;
};
export const findUserByEmailAndLoginType = async (email: string, loginType: LoginType) => {
  const user = await User.findUnique({ 
    where: { 
      email: email, 
      loginType : loginType 
    } 
  });
  return user;
};
export const findUserByID = async (ID: string) => {
  const user = await User.findUnique({
    where: {
      id: ID
    }
  });
  return user;
}

export const Find = async (id: string) => {
  const user = await User.findUnique({
    where: { id: id },
    include: {
      Inventory: {
        select: {
          Item: true,
          amount: true,
        }
      },
      CompletedQuest: true,
      LandMarkInteract: true,
      LandMarkCheckIn: true,
    }
  });

  if(user)
  {
    //Check Item expire
    const temp = [];
    for(let i = 0;i < user.Inventory.length;i++)
    {
        const isExpire = await isExpired(user.Inventory[i].Item.id);
        if(isExpire)
        {
          await deleteUserItem(user.id,user.Inventory[i].Item.id);
          delete(user.Inventory[i]);
        }
        else
        {
          temp.push(user.Inventory[i]);
        }
    }
    user.Inventory = temp;
  }
  
  return user;
};
const importantEmails = [
  "noobmansaturnv.2@gmail.com",
  "niatanin@icloud.com",
  "nokzoo20@gmail.com"
];

export const Create = async (profile: GoogleProfile) => {
  if (!profile) throw new Error("No profile");

  const user = await User.create({
    data: {
      email: profile.email,
      FirstLogin: new Date(),
      userName: null,
      lastUpdate: new Date(),
      firstName: profile.name,
      profileUrl: profile.picture,
      currentQuest: {},
      collection: {},
    },
  });
  
  if(importantEmails.includes(user.email))
  {
    console.log(user.email);
    await User.update({
      where : {
        email : user.email
      },
      data : {
        admin : true
      }
    })
  }
  await createUserLeaderBoard(user.id);

  return user;
};

export const CreateByEmail = async (email: string, loginType : LoginType) => {
  if (!email || !loginType) throw new Error("No profile");

  const user = await User.create({
    data: {
      email: email,
      FirstLogin: new Date(),
      userName: null,
      lastUpdate: new Date(),
      loginType: loginType,
      currentQuest: {},
      collection: {},
    },
  });
  
  
  if(importantEmails.includes(user.email))
  {
    console.log(user.email);
    await User.update({
      where : {
        email : user.email
      },
      data : {
        admin : true
      }
    })
  }
  await createUserLeaderBoard(user.id);

  return user;
};

export const findItemExisted = async (id: string, itemId: string) => {

  const userItem = await UserItem.findFirst({
    where: {
      AND: [{ userId: id }, { itemId: itemId }]
    },
  });

  return userItem
}

