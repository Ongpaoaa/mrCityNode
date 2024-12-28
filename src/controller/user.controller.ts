import { Request, Response } from "express";
import * as userService from "@/service/user.service";
import * as sessionService from "@/service/session.service";
import { CompletedQuest, Item, Quest, User, UserItem, Gacha, GachaTicketUsed,UserLogin, FeedBackQuestion, FeedBackAnswer } from "@/lib/prisma";
import { Language, LoginType, Prisma, QuestStatus } from "@prisma/client";
import {
  UpdateCollectionItem,
  UpdateItemUsed,
} from "@/service/journal.service";
import { error } from "console";

export const Login = async (req: Request, res: Response) => {
  try
  {
    const { email, loginType }: 
    { 
      email:string,
      loginType: LoginType
    } = req.body;
    const user = await userService.findUserByEmailAndLoginType(email, loginType);
    if(!user)
    {
      const user = await userService.CreateByEmail(email, loginType);
      const session = await sessionService.Create(user.id);

      await UserLogin.create({
        data:{
          userId: user.id,
          time: new Date()
        }
      });
      return res.status(201).send({ 
        success: true, 
        message: "Login Success",
        "session" : session });
    }
    else
    {
      const session = await sessionService.Create(user.id);
      
      await UserLogin.create({
        data:{
          userId: user.id,
          time: new Date()
        }
      });
      return res.status(201).send({ 
        success: true, 
        message: "Login Success",
        "session" : session });

    }
  }
  catch(error)
  {
    console.log(error);
    res.status(400).send({ success : false, error});
  }
}

export const getUser = async (req: Request, res: Response) => {
  const user = await userService.Find(req.userId);
  return res.status(201).send(user);
};

export const CreateUserName = async (req: Request, res: Response) => {
  const user = await User.findFirst({
    where: { AND: [{ userName: null }, { id: req.userId }] },
  });
  if (!user) {
    return res
      .status(400)
      .send({ success: false, error: "UserName already exits" });
  }

  await User.update({
    where: { id: req.userId },
    data: { 
      userName: req.body.userName,
      lastUpdate: new Date()
    },
  });

  return res.status(201).send("userName created!");
};

export const Rename = async (req: Request, res: Response) => {
  const { newName } : { newName : string } = req.body;
  const user = await User.findFirst({
    where:  { 
      id: req.userId 
    }
  })
  if(user) 
  {
    if(user.userName)
    {
      await User.update({
        where: { id: req.userId },
        data: { 
          userName: newName,
          lastUpdate: new Date()
        },
      });
      return res.status(200).send({ success : true, message : "Rename Success"});
    
    }
    else
      return res.status(400).send({ success : false, message : "User Don't Have Name"});
  }
  else
    return res.status(404).send({ success : false, message : "Cannot Find User"});
}

export const GetUserInventory = async (req: Request, res: Response) => {
  try {
    const Inventory = await UserItem.findMany({
      where: {
        userId: req.userId,
      },
      select: {
        Item: true,
        amount: true,
      },
    });

    res.status(200).send({ Inventory });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const GetUserCollection = async (req: Request, res: Response) => {
  try {
    const user = await User.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        collection: true,
      },
    });

    res.status(200).send({ ...user });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const GetUserCurrentQuest = async (req: Request, res: Response) => {
  try {
    const user = await User.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        currentQuest: true,
      },
    });

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const GetUserCompletedQuest = async (req: Request, res: Response) => {
  try {
    const completedQuest = await CompletedQuest.findMany({
      where: {
        userId: req.userId,
      },
      select: {
        Quest: true,
        time: true,
      },
    });

    const CompletedQuests = completedQuest.map((quest: any) => {
      return {
        Id: quest.Quest.id,
        name: quest.Quest.name,
        description: quest.Quest.description,
        TypeQuest: quest.Quest.target.TypeQuest,
        time: quest.time,
      };
    });

    res.status(200).send({ success: true, CompletedQuests });
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, error });
  }
};

export const UpdateTutorialStep = async (req: Request, res: Response) => {
  try{
    const user = await User.findUnique({
      where: {
        id : req.userId
      }
    })
    if(user)
    {
      const newStep = user.tutorialStep ? user.tutorialStep + 1 : 1;
      await User.update({
        where: {
          id: req.userId
        },
        data : {
          tutorialStep : newStep
        }
      })
      return res.status(200).send({ success: true });
    }
  }
  catch(error)
  {
    console.log(error);
    res.status(400).send({ success : false, error });
  }
}

export const UpdateLanguage = async (req: Request, res: Response) => {
  try
  {
    const { newLanguage } : { newLanguage : Language } = req.body;
    const user = await User.update({
      where: {
        id : req.userId
      },
      data : {
        language: newLanguage
      }
    })
    return res.status(200).send({ success: true });
  }
  catch(error)
  {
    console.log(error);
    return res.status(500).send({ success:false , error });
  }
}

export const UpdateReward = async (req: Request, res: Response) => {
  try {
    const user = await User.findUnique({
      where: { id: req.userId },
    });

    const status = user?.currentQuest.status as string | undefined;
    if (status === QuestStatus.undefined) {
      return res
        .status(400)
        .send({ success: false, error: "you do not have a quest" });
    }

    const questId = user?.currentQuest.questId as string;
    if (status === "completed") {
      await CompletedQuest.create({
        data: {
          userId: req.userId,
          questId: questId,
        },
      });

      await User.update({
        where: {
          id: req.userId,
        },
        data: {
          lastUpdate: new Date(),
          currentQuest: {
            set: {},
          },
        },
      });
    }

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const UpdateCurrentQuest = async (req: Request, res: Response) => {
  try {
    const completedquest = await CompletedQuest.findFirst({
      where: { userId: req.userId, questId: req.body.questId },
    });

    if (completedquest?.questId !== undefined) {
      return res
        .status(400)
        .send({ success: false, error: "The user has completed the quest." });
    }

    await User.update({
      where: { id: req.userId },
      data: {
        lastUpdate: new Date(),
        currentQuest: {
          set: {
            questId: req.body.questId,
            progress: 0,
            status: QuestStatus.inProgress,
          },
        },
      },
      select: {
        id: true,
        currentQuest: true,
      },
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};

export const UpdateProgress = async (req: Request, res: Response) => {
  try {
    const existingquest = await User.findUnique({
      where: { id: req.userId },
    });

    const questId = existingquest?.currentQuest.questId as string | null;
    if (questId === null) {
      return res
        .status(400)
        .send({ success: false, error: "you do not have a quest" });
    }

    const quest = await Quest.findUnique({
      where: { id: questId },
    });

    const userProgress = existingquest?.currentQuest.progress ?? 0;
    const MaxProgress = Number(quest?.target.MaxProgress);
    const newProgress = userProgress + 1;
    if (newProgress <= MaxProgress) {
      await User.update({
        where: { id: req.userId },
        data: {
          lastUpdate: new Date(),
          currentQuest: {
            update: {
              progress: newProgress,
              status: QuestStatus.inProgress,
            },
          },
        },
      });
    }
    if (newProgress == MaxProgress) {
      await User.update({
        where: { id: req.userId },
        data: {
          lastUpdate: new Date(),
          currentQuest: {
            update: {
              status: QuestStatus.completed,
            },
          },
        },
      });
    }

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};

export const UpdateUserInventory = async (req: Request, res: Response) => {
  try {
    const { itemId, amount } = req.body;

    const findItem = await Item.findUnique({
      where: { id: itemId },
    });
    
    if (findItem === null) {
      return res.status(400).send({ message: "Item Not Found" });
    }

    const findExistedInInventory = await userService.findItemExisted(
      req.userId,
      itemId
    );

    if (findExistedInInventory) {
      const newamount = amount + findExistedInInventory.amount;

      if (newamount < 0) {
        return res
          .status(400)
          .send({ message: "You don't have enough of the item" });
      } else if (newamount == 0) {
        await UserItem.delete({
          where: {
            id: findExistedInInventory.id,
          },
        });

      } else {
        await UserItem.updateMany({
          where: {
            userId: req.userId,
            itemId: itemId,
          },
          data: {
            amount: newamount,
          },
        });
      }

      await UpdateItemUsed(req.userId, itemId);
    } else {
      const min_amount = 1;
      const amountContorl =
        amount !== undefined ? Math.max(min_amount, amount) : amount;
      await UserItem.create({
        data: {
          itemId: itemId,
          amount: amountContorl,
          userId: req.userId,
        },
      });
    }
    await User.update({
      where: { id: req.userId },
      data: {
        lastUpdate: new Date(),
      },
    });

    res.status(201).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};
export const UseGacha = async (req: Request, res: Response) => {
  try{
    const { gachaId } = req.body;

    const gachaItem = await Gacha.findUnique({
      where: { itemId: gachaId },
    });
    if(gachaItem && gachaItem.drop)
    {
      const list: string[] = gachaItem.drop;
      const randomIndex = Math.floor(Math.random() * list.length);
      const rewardID = list[randomIndex]
      if(list[randomIndex])
      {
        await GachaTicketUsed.create({
          data: {
            userId: req.userId,
            itemId: gachaId,
            rewardId: rewardID
          }
        });
        res.status(200).send({success: true, rewardID})
      }
      else
      {
        return res.status(500).send({success: false, message: "item's ID Not Found"})
      }
    }
    else{
      return res.status(500).send({success: false, message: "Gacha's ID Not Found"})
    }
    
  }
  catch(error)
  {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
}

export const Logout = async (req: Request, res: Response) => {
  await sessionService.Delete(req.headers.ssid as string);
  return res.status(200);
};

export const AnswerQuestion = async (req: Request, res: Response ) => {
  try
  {
    const { questionID, Answer } : { questionID: string, Answer: string} = req.body;

    const Question = await FeedBackQuestion.findUnique({
      where: { id: questionID },
    })
    const isAnswer = await FeedBackAnswer.findFirst({
      where:{
        questionId: questionID,
        userId: req.userId
      }
    })
    if(isAnswer)
      return res.status(200).send({ success: true, message: "User already answer" });
    
    if(!Question)
    {
      return res.status(404).send({ success: false, message: "Question Id not found" })
    }
    
    const AnswerQuestion = await FeedBackAnswer.create({
      data: {
        answer: Answer,
        questionId: questionID,
        userId: req.userId,
        createAt: new Date()
    }});
    return res.status(200).send({ success: true, AnswerQuestion });
  }
  catch
  {
      console.log(error)
      return res.status(400).send({ success: false, error })
  }
}

export const UpdateTutorialBoolean = async (req: Request, res: Response ) => {
  try
  {
    const { boolType }: { boolType: string } = req.body;
    switch(boolType)
    {
      case "inventory":
        await User.update({
          where: {
            id : req.userId
          },
          data : {
            tutorialInventory : false
          }
        })
        break;
      case "landmarkInfo":
        await User.update({
          where: {
            id : req.userId
          },
          data : {
            tutorialLandmarkInfo : false
          }
        })
        break;
      case "landmarkMap":
        await User.update({
          where: {
            id : req.userId
          },
          data : {
            tutorialLandmark : false
          }
        })
        break;
      case "collection":
        await User.update({
          where: {
            id : req.userId
          },
          data : {
            tutorialCollection : false
          }
        })
        break;

    }
    return res.status(200).send({ success: true })
  }
  catch
  {
      console.log(error)
      return res.status(400).send({ success: false, error })
  }
}