
import { Landmark, User, Item, UserItem, NPCInteract, NPC, ItemUsed, Antique, LandMarkInteract, LandmarkCheckin } from "@/lib/prisma";
import { updateUserCollectionCount } from "@/service/board.service";
import { existedCheckin, existedCollect, existedInteract, existedUse, UpdateCollectionItem, existedUsed } from "@/service/journal.service";
import { AntiqueStatus, collectStatus, Prisma } from "@prisma/client";
import { Request, Response } from "express";

export const GetUsedItemByPlayer = async (req: Request, res: Response) => {
  try {
    const { itemId }: { itemId: string } = req.body;
    const itemUsed = await ItemUsed.findFirst({
      where: {
        AND: {
          itemId: itemId,
          userId: req.userId
        }
      },
      take: -1
    })
    res.status(200).send(itemUsed);
  } catch (error) {
    res.status(500).send({ success: false, error })
  }
}

export const GetNPCInteractByPlayer = async (req: Request, res: Response) => {
  try{
    const AllInteractsNPC = await NPCInteract.findMany({
      where:{
        userId: req.userId
      }
    });
    
    res.status(200).send(AllInteractsNPC);
  }
  catch (error){
    res.status(500).send({
      success: false, error
    })
  }
}
export const UpdateAntiqueStatus = async (req: Request, res: Response) => {
  try{
    const { antiqueId, status }: { antiqueId: string, status: string} = req.body;
    const antiqueexisted = await Antique.findUnique({
      where: { id: antiqueId }
    });
    if(antiqueexisted)
    {
      const userAntique = await existedCollect(req.userId,antiqueId,"item");
      
      //get antique current status
      const existInteract = await existedInteract(req.userId, antiqueId);
      const existUse = await existedUse(req.userId, antiqueId);
      const existUsed = await existedUsed(req.userId, antiqueId);

      switch(status)
      {
        case("Found"):
          if(!userAntique)
          {
            try
            {
              await User.update({
                where: { id: req.userId },
                data: {
                  AntiqueInteract: {
                    create: { antiqueId: antiqueId }
                  },
                },
              });
              await UpdateCollectionItem(req.userId, antiqueId, AntiqueStatus.Found);
              return res.status(200).send({ success: true, });
            }
            catch(error)
            {
              console.log(error);
              return res.status(500).send({ success: false,error });
            }
          }
          else
          {
            return res.status(500).send({ success: false, message: "User already have this antique"});
          }
        case("Navigate"):
          if(userAntique && existInteract && !existUse && !existUsed)
            try
            {
              await User.update({
                where: { id: req.userId },
                data: {
                  AntiqueNavigate: {
                    create: { antiqueId: antiqueId }
                  },
                },
              });
              await UpdateCollectionItem(req.userId, antiqueId, AntiqueStatus.Navigated);
              return res.status(200).send({ success: true, });
            }
            catch(error)
            {
              console.log(error);
              return res.status(500).send({ success: false,error });
            }
          else
          {
            return res.status(500).send({ success: false, message: "Antique status is not Found"});
          }
        case("Complete"):
          if(userAntique && existInteract && existUse && !existUsed)
          {
            try
            {
              await User.update({
                where: { id: req.userId },
                data: {
                  AntiqueUsed: {
                    create: { antiqueId: antiqueId }
                  },
                },
              });
              await UpdateCollectionItem(req.userId, antiqueId, AntiqueStatus.Complete);
              return res.status(200).send({ success: true, });
            }
            catch(error)
            {
              console.log(error);
              return res.status(500).send({ success: false,error });
            }
          }
          else
          {
            return res.status(500).send({ success: false, message: "Antique status is not Navigate"});
          }
          default:
            return res.status(404).send({ success: false, message: "Status Not Found"});
      }
    }
    else
    {
      return res.status(404).send({ success: false, message: "Antique Not Found" });
    }
  }
  catch(error) {
    res.status(500).send({
      success: false, error
    })
  }
}
export const UpdateTotorial = async (req: Request, res: Response) => {
  try {
    await User.update({
      where: {
        id: req.userId
      },
      data: {
        lastUpdate: new Date(),
        isTutorial: {
          set: true
        }
      }
    });

    res.status(200).send({ success: true, });
  } catch (error) {
    res.status(500).send({ success: false, error })
  }
}

export const CreateLandmarkCheckIn = async (req: Request, res: Response) => {
  try {
    const { landmarkId}: { landmarkId: string } = req.body;
    const collected = await existedCollect(req.userId, landmarkId, "landMark");
    const checkin = await existedCheckin(req.userId, landmarkId);

    if (collected && !checkin) {
      await User.update({
        where: { id: req.userId },
        data: {
          lastUpdate: new Date(),
          LandMarkCheckIn: {
            create: {
              landMarkId: landmarkId
            }
          },
          collection: {
            update: {
              landMark: {
                updateMany: {
                  where: {
                    id: landmarkId
                  },
                  data: {
                    status: collectStatus.Collected
                  }
                }
              }
            }
          }
        },
      });

      await updateUserCollectionCount(req.userId);

      res.status(200).send({ success: true, });
    } else {
      return res.status(400).send({
        success: false,
        message: "Collection with ID [landmarkId] not correct.",
      });
    }
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
}

export const CreateLandmarkInteraction = async (req: Request, res: Response) => {
  try {
    const { landmarkId }: { landmarkId: string } = req.body;
    const landMarkexisted = await Landmark.findUnique({
      where: { id: landmarkId }
    });

    if (landMarkexisted) {

      const user = await User.update({
        where: { id: req.userId },
        data: {
          lastUpdate: new Date(),
          LandMarkInteract: {
            create: {
              landMarkId: landmarkId
            }
          }
        }
      });

      const collected = await existedCollect(req.userId, landmarkId, "landMark");
      if (!collected) {
        await User.update({
          where: { id: req.userId },
          data: {
            lastUpdate: new Date(),
            collection: {
              update: {
                landMark: {
                  push: {
                    id: landmarkId
                  }
                }
              }
            }
          }
        })
      }
      res.status(200).send({ success: true });
    } else {
      return res.status(400).send({
        success: false,
        message: "Landmark with ID [landmarkId] not found.",
      });
    }


  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2023") {
        return res.status(400).send({
          success: false,
          message: "Invalid Object ID",
        });
      }
    }
    res.status(500).send({ success: false, error });
  }

}
export const CreateLandmarkPhoto = async (req: Request, res: Response) => {
  try {
    const { landmarkId }: { landmarkId: string } = req.body;
    const landMarkexisted = await Landmark.findUnique({
      where: { id: landmarkId }
    });

    if (landMarkexisted) {

      await User.update({
        where: { id: req.userId },
        data: {
          lastUpdate: new Date(),
          LandmarkPhoto: {
            create: {
              landMarkId: landmarkId
            }
          }
        }
      });

      
      res.status(200).send({ success: true });
    } else {
      return res.status(400).send({
        success: false,
        message: "Landmark with ID [landmarkId] not found.",
      });
    }


  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2023") {
        return res.status(400).send({
          success: false,
          message: "Invalid Object ID",
        });
      }
    }
    res.status(500).send({ success: false, error });
  }
}
export const CreateNPCInteraction = async (req: Request, res: Response) => {
  try {
    const { NPCId }: { NPCId: string } = req.body;

    const findNPC = await NPC.findUnique({
      where: { id: NPCId }
    });

    if (findNPC) {
      await NPCInteract.create({
        data: {
          NPCId: NPCId,
          userId: req.userId
        }
      });
    } else {
      return res.status(400).send({ message: "NPC Not Found" });
    }

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }

}

// export const CreateUserCollection = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findUnique({
//       where: { id: req.userId },
//     });

//     const { item, landMark } = user?.collection || { item: [], landMark: [] };
//     const { type, id }: { type: string; id: string } = req.body;

//     const filteredItem = item.filter((itemId) => itemId === id);
//     const filteredLandmark = landMark.filter((landMarkId) => landMarkId === id);

//     if (filteredItem.length === 0 && filteredLandmark.length === 0) {
//       if (type === "landMark") {
//         landMark.push(id);
//       } else if (type === "item") {
//         item.push(id);
//       }
//       await User.update({
//         where: {
//           id: req.userId,
//         },
//         data: {
//           collection: {
//             landMark: landMark,
//             item: item,
//           },
//         },
//       });

//       await updateUserCollectionCount(req.userId);

//     return res.status(200).send({ success: true });
//     } else {
//       return res.status(400).send({
//         success: false,
//         message: "You already have it in your collection.",
//       });
//     }
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2023") {
//         return res.status(400).send({
//           success: false,
//           message: "Invalid Object ID",
//         });
//       }
//     }
//     res.status(500).send({ success: false, error });
//   }
// };


