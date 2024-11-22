import { Antique } from "@/lib/prisma";
import { Request, Response } from "express";

export const Create = async (req: Request, res: Response) => {
    try 
    {
        const antique = await Antique.create({ data: req.body });
        return res.status(201).send({ success: true, data: antique });
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}

export const GetAll = async (req: Request, res: Response) => {
    try
    {
        const allAntique = await Antique.findMany();
        return res.status(201).send({ success: true, data: allAntique });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}

export const GetById = async (req: Request, res: Response) => {
    try
    {
        const { antiqueId }: { antiqueId: string} = req.body;
        const antique = await Antique.findFirst({
            where:{
                id:antiqueId
            }
        })
        if(antique)
        {
            return res.status(201).send({ success: true, data: antique });
        }
        return res.status(404).send({ success: false, message: "Antique Not Found"});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).send({ success: false, error });
    }
}
