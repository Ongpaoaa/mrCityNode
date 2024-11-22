import { FeedBackQuestion } from "@/lib/prisma";
import { Request, Response } from "express";

export const CreateFeedBack = async ( req: Request, res: Response ) => {
    try
    {
        const feed = await FeedBackQuestion.create({
            data: req.body
        })
        
        return res.status(200).send({ success: true, feed })
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send({ success: false, error })
    }
}

export const GetFeedBackQuestion = async ( req: Request, res: Response ) => {
    try
    {
        const question = await FeedBackQuestion.findMany();
        return res.status(200).send({ success: true, question })
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send({ success: false, error })
    }
}

export const GetFeedBackAnswer = async ( req: Request, res: Response ) => {
    //question id
    //return question with answer
}