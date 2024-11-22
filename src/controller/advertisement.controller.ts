import { Advertisement } from "@/lib/prisma";
import { Request, Response } from "express";


export const CreateAd = async ( req : Request,res : Response ) => {
    try
    {
        const newAd = await Advertisement.create(req.body);
        return res.status(200).send({ success: true, newAd});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}

export const GetAll = async (req : Request, res : Response ) => {
    try
    {
        const data = await Advertisement.findMany();
        return res.status(200).send({ success: true, data});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}