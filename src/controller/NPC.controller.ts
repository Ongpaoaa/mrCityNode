import { NPC } from "@/lib/prisma";
import { Request, Response } from "express";

export const GetAll = async (req: Request, res: Response) => {
    try {
      const npc = await NPC.findMany();
      res.status(200).send({ success: true, data: npc });
    } catch (error) {
      res.status(500).send({ success: false, error });
    }
};

export const Create = async (req: Request, res: Response) => {
    try {
      const npc = await NPC.create({ data: req.body });
      return res.status(201).send({ success: true, data: npc });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, error });
    }
};
export const GetIdByName = async (req: Request, res: Response) => {
    try {
      const npc = await NPC.findUnique({
        where: {
            name: req.params.name,
        },
        select:{
          id: true,
        }
      });
  
      return res.status(200).send({ success: true, ...npc});
      
    } catch (error) {
      return res.status(500).send({ success: false, error });
    }
  };
  export const DeleteId = async (req: Request, res: Response) => {
    try {
      const landmark = await NPC.delete({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({ success: true, data: landmark });
    } catch (error) {
      res.status(500).send({ success: false, error });
    }
  };