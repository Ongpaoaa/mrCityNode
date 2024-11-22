import { LandmarkCheckin, LandMarkInteract, NPCInteract, ItemUsed, UserLogin } from "@/lib/prisma";
import { Response, Request } from "express";

export const GetLandMarkInteractionCount = async (req: Request, res: Response) => {
    try {
        const { landmarkId }: { landmarkId: string } = req.body;
        const interact = await LandMarkInteract.findMany({
            where: {
                landMarkId: landmarkId,
            }
        });
        if (interact) {
            console.log(interact.length);
            return res.status(200).send({ success: true, message: interact.length });
        }
        return res.status(500).send({ success: false, message: "Could not find landmark with this ID [landmarkId]" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
}

export const GetLandMarkCheckInCount = async (req: Request, res: Response) => {
    try {
        const { landmarkId, startPeriod, endPeriod  } = req.body;

        const checkInCount = await LandmarkCheckin.count({
            where: {
                landMarkId: landmarkId,
                time: {
                    gte: new Date(startPeriod), // Greater than or equal to startPeriod
                    lte: new Date(endPeriod),   // Less than or equal to endPeriod
                },
            },
          });
        if (checkInCount) {
            console.log(checkInCount );
            return res.status(200).send({ success: true, count: checkInCount });
        }
        return res.status(500).send({ success: false, message: "Could not find landmark with this ID [landmarkId]" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
}
export const GetItemUsedCount = async (req: Request, res: Response) => {
    try
    {
      const { itemId, startPeriod, endPeriod } = req.body;
      const item = await ItemUsed.count({
        where:{
          itemId : itemId,
          time: {
            gte: new Date(startPeriod), // Greater than or equal to startPeriod
            lte: new Date(endPeriod),   // Less than or equal to endPeriod
        },
        }
      });
      if(item)
      {
        console.log(item);
        return res.status(200).send({ success: true, message: item});
      }
      return res.status(500).send({ success: false, message: "Could not find landmark with this ID [landmarkId]"});
    }
    catch(error)
    {
      console.log(error);
      res.status(500).send({ success: false, error});
    }
  }
  export const GetUserLoginCount = async (req: Request, res: Response) => {
    try{
        const { startPeriod, endPeriod } = req.body;

    if (!startPeriod || !endPeriod) {
        return res.status(400).json({ error: "Both startPeriod and endPeriod are required" });
      }

      const loginCount = await UserLogin.count({
        where: {
          time: {
            gte: new Date(startPeriod), // Greater than or equal to startPeriod
            lte: new Date(endPeriod),   // Less than or equal to endPeriod
          },
        },
      });
    return res.status(200).send({ success: true, count: loginCount });
    }
    catch(error)
    {
        console.log(error);
        return res.status(404).send({ success: false, error });
    }
  }