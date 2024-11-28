import { Item } from "@/lib/prisma";
import { Request, Response } from "express";
import * as itemservice from "@/service/item.service";
import { create } from "domain";

export const GetAll = async (req: Request, res: Response) => {
  try {
    const items = await Item.findMany();
    return res.status(200).send({ success: true, data: items });
  } catch (error) {
    return res.status(500).send({ success: false, error });
  }
};

export const Create = async (req: Request, res: Response) => {
  try {
    const item = await Item.create({ data: req.body });
    return res.status(201).send({ success: true, data: item });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error });
  }
};

export const Update = async (req: Request, res: Response) => {
  try {
    const item = await Item.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    return res.status(200).send({ success: true, data: item });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error });
  }
};

export const GetById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findFirst({
      where: {
        id: req.params.id,
      },
    });

    if (item) 
    {
      return res.status(200).send({ success: true, data: item });
    } 
    else 
    {
      return res.status(404).send({ success: false, error: "Item not found" });
    }
  } catch (error) {
    return res.status(500).send({ success: false, error });
  }
};

export const Test = async (req: Request, res: Response) => {
  try {
    const items = await Item.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    for (const item of items) 
      {
        await Item.update({
          where:{
            id: item.id
          },
          data: {
              // Name: {
              //   Thai: item.name,
              //   English: item.name,
              // },
              // Description: {
              //   Thai: item.description,
              //   English: item.description,
              // },
              // Summerize: {
              //   Thai: "",
              //   English: "",
              // },
              // Important: {
              //   Thai: "",
              //   English: "",
              // },
              // LocationUsedId:["673f3a0c66eb37359dd5f2b4"],
              // createAt:new Date(),
              // isExpire: false
              imageURL: ""
            },
          
        });
      
    }
  
    res.status(201).send({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error });
  }
};