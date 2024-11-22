import { Request, Response } from "express";
import { CompletedQuest, Item, Quest, User, UserItem, Gacha } from "@/lib/prisma";
import * as userService from "@/service/user.service";
import { UpdateCollectionItem, UpdateItemUsed, } from "@/service/journal.service";
import { QuestStatus, TypeItem } from "@prisma/client";

export const GetAll = async (req: Request, res: Response) => {
    try {
        const gacha = await Gacha.findMany();
        res.status(200).send({ success: true, data: gacha});
    }
    catch(error) {
        console.log(error);
        res.status(500).send({ success : false, error });
    }
};
export const Create = async (req: Request, res: Response) => {
    try{
        const gacha = req.body;
        
        const ticket = await Item.findFirst({
            where: {
                id : gacha.itemId
            }
        })
        if(!ticket)
            return res.status(500).send({  success: false, message: "item's id not found in data" })

        if(ticket?.type != TypeItem.GachaTicket)
            return res.status(500).send({  success: false, message: "item's not gacha ticket" })
        //check
        const list: string[] = gacha.drop;
        for(let i = 0;i < list.length; i++)
        {
            const item = await Item.findFirst({
                where: {
                    id : list[i]
                }
            });
            if(item)
                continue;
            else
                return res.status(500).send({ success: false, message: "dropRate's id not found in data" })
        }
        await Gacha.create({ data: gacha})
        res.status(200).send({ success: true });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({ success: false,error });
    }
};
// export const AddMoreDrop = async (req: Request, res: Response) => {
//     try{
//         const 
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).send({ success: false,error });
//     }
// }