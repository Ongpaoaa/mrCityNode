import { Quest, User } from "@/lib/prisma";
import { Request, Response } from "express";


export const GetAll = async (req: Request, res: Response) => {
  try {
    const quest = await Quest.findMany();
    res.status(200).send({ success: true, data: quest });
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, error });
  }
};

export const GetId = async (req: Request, res: Response) => {
  try {
    const quest = await Quest.findUnique({
      where: {
        id: req.params.id,
      }
    });
    res.status(200).send({ success: true, data: quest });
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, error });
  }
};

export const Create = async (req: Request, res: Response) => {
  try {
    const quest = await Quest.create({ data: req.body });
    res.status(201).send({ success: true, data: quest });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};


export const Delete = async (req: Request, res: Response) => {
  try {
    await Quest.delete({
      where: {
        id: req.params.id
      }
    });    

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const Update = async (req: Request, res: Response) => {
  try {
    const quest = await Quest.update({
      where: {
        id: req.params.id
         
      },
      data: req.body,
    });

    res.status(201).send({ success: true, data: quest });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const UpdateLocalize = async (req: Request, res: Response) => {
  try {
    // Only fetch 'id' and 'Name' fields to reduce memory usage
    const quests = await Quest.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
    });

    // Use a transaction to update all records if possible
    await Promise.all(
      quests.map((quest) =>
        Quest.update({
          where: { id: quest.id },
          data: {
            Name: {
              Thai: quest.name,
              English: "",
            },
            Description: {
              Thai: quest.description,
              English: ""
            }
          },
        })
      )
    );

    res.status(201).send({ success: true, data: quests });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
}