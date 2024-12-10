import { Request, Response } from "express";
import { Admin, CompletedQuest, Item, Quest, User, UserItem } from "@/lib/prisma";
import * as userService from "@/service/user.service";
import { UpdateItemUsed } from "@/service/journal.service";
import { QuestStatus } from "@prisma/client";
import { date } from "zod";

export const GetAllUser = async (req: Request, res: Response) => {
    try
    {
        const user = await User.updateMany({
            data: {
                tutorialStep : 20
            }
        });
        return res.status(201).send({success: true, user})
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({success: false, error});
    }
}
export const GetUser = async (req: Request, res: Response) => {
    try
    {
        const { userId }: { userId: string } = req.body;
        const user = await User.findFirst({
            where: {
                email : userId,
            }
        });
        if(user)
            return res.status(201).send({success: true, user});
        else
            return res.status(404).send({success: false, message: "User Not Found"});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({success: false, error});
    }
}
export const UpdateAdmin = async (req: Request, res: Response) => {
    try
    {
        const { userId }: { userId: string } = req.body;
        const user = await User.update({
            where: {
                email : userId,
            },
            data: {
                admin : true
            }
        });
        return res.status(201).send({success: true, user})
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({success: false, error});
    }
}
export const UpdateUserInventory = async (req: Request, res: Response) => {
    try
    {
        const { userEmail, itemId , amount } = req.body;

        const findItem = await Item.findUnique({
            where: {id : itemId},
        });
        const user = await User.findFirst({
            where: {
                email : userEmail,
            }
        });
        const userId  = user?.id;
        if(!userId)
            return res.status(404).send({ message: "This Player not found"});
        if(findItem === null)
        {
            return res.status(400).send({ message: "Item not Found"})
        }
        const isItemExistedInInventory = await userService.findItemExisted
        (
            userId,
            itemId
        );
        if(isItemExistedInInventory)
        {
            const newamount = amount + isItemExistedInInventory.amount;
            
            if(newamount < 0)
            {
                return res
                    .status(400)
                    .send({message: "This user dont have enough of item"});
            }
            else if(newamount == 0)
            {
                await UserItem.delete({
                    where:{
                        id: isItemExistedInInventory.id,
                    },
                });
            }
            else
            {
                await UserItem.updateMany({
                    where: {
                        userId: userId,
                        itemId: itemId,
                    },
                    data: {
                        amount: newamount,
                    }
                });
            }
            await UpdateItemUsed(userId, itemId);
        }
        else
        {   
            const minAmount = 1;
            const amountContorl = amount !== undefined ? Math.max(minAmount, amount) : amount;

            await UserItem.create({
                data: {
                    itemId: itemId,
                    amount: amountContorl,
                    userId: userId,
                },
            });
        }
        res.status(201).send({ success: true });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({ success: false, error});
    }
};

export const UpdateUserCurrentQuest = async (req: Request, res: Response) => {
    try
    {
        const { userId, questId } = req.body;

        const isQuestCompleted = await CompletedQuest.findFirst({
            where:{
                userId: userId,
                questId: questId,
            },
        });

        if(isQuestCompleted?.questId !== undefined)
        {
            return res
                .status(400)
                .send({ success: false, error: "This user has already complete this quest"})
        }
        await User.update({
            where: {id: userId},
            data: {
                currentQuest: {
                    set: {
                        questId: questId,
                        progress: 0,
                        status: QuestStatus.inProgress,
                    },
                },
            },
            select:{
                id: true,
                currentQuest: true,
            },
        });
        res.status(200).send({ success: true });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
};

export const UpdateUserQuestProgress = async (req: Request, res: Response) => {
    try{
        const { userId } = req.body;

        const isQuestExisting = await User.findUnique({
            where: { id: userId },
        });

        const questId = isQuestExisting?.currentQuest.questId as string | null;
        if(questId === null)
        {
            return res
                .status(400)
                .send({ success: false, error: "This player don't have quest"})
        }
        const quest = await Quest.findUnique({
            where: {id: questId},
        });

        const userProgress = isQuestExisting?.currentQuest.progress ?? 0;
        const MaxProgress = Number(quest?.target.MaxProgress);
        const newProgress = userProgress + 1;
        
        if (newProgress <= MaxProgress)
        {
            await User.update({
                where: { id: req.userId },
                data: {
                    currentQuest: {
                        update: {
                        progress: newProgress,
                        status: QuestStatus.inProgress,
                    },
                    },
                },
            });
        }
        else if (newProgress == MaxProgress) 
        {
            await User.update({
                where: { id: req.userId },
                data: {
                    currentQuest: {
                        update: {
                            status: QuestStatus.completed,
                        },
                    },
                },
            });
        }
        res.status(200).send({ success: true });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({ success: false, error }); 
    }
}

export const CreateAdminSetUp = async (req: Request, res: Response) => {
    try
    {
        const setUp = await Admin.findMany();
        if(setUp && setUp.length == 0)
        {
            const currentSetUp = await Admin.create({ data: req.body });
            return res.status(201).send({ success: true, data: currentSetUp });
        }
        return res.status(500).send({ success : false, data: "Object already existed" });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}

export const GetAPPSetup = async (req: Request, res: Response) => {
    try
    {
        const setUp = await Admin.findMany();
        return res.status(201).send({ success: true, data: setUp[0]});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}
export const UpdateSetUp = async (req: Request, res: Response) => {
    try
    {
        
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send
    }
}
