import { Landmark, LandMarkInteract } from "@/lib/prisma";
import { Request, Response } from "express";

import { Area, LandMarkType, LocalizationString } from "@prisma/client";

export const Create = async (req: Request, res: Response) => {
  try {
    const landmark = await Landmark.create({ data: req.body });
    res.status(201).send({ success: true, data: landmark});
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, error });
  }
};

export const GetAll = async (req: Request, res: Response) => {
  try {
    const landmark = await Landmark.findMany();
    res.status(200).send({ success: true, data: landmark });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
};

export const GetAllSongkhla = async (req: Request, res: Response) => {
  try {
    const landmark = await Landmark.findMany({
      where:{
        Area: Area.Songkhla
      }
    });
    res.status(200).send({ success: true, data: landmark });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const GetAllZoo = async (req: Request, res: Response) => {
  try {
    const landmark = await Landmark.findMany({
      where:{
        Area: Area.Zoo
      }
    });
    res.status(200).send({ success: true, data: landmark });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const GetId = async (req: Request, res: Response) => {
  try {
    const landmark = await Landmark.findUnique({
      where: {
        id: req.params.id,
      }
    });
    res.status(200).send({ success: true, data: landmark });
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, error });
  }
};
export const UpdateLocalize = async (req: Request, res: Response) => {
  try {
    // Only fetch 'id' and 'Name' fields to reduce memory usage
    const landmarks = await Landmark.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        workshop: true,
        menu: true
      },
    });
    
    // Use a transaction to update all records if possible
    await Promise.all(
      landmarks.map((landmark) => {
        var workshopName = landmark.workshop?.name ?? "";
        var workshopDes = landmark.workshop?.description ?? "";
        
        return Landmark.update({
          where: { id: landmark.id },
          data: {
            Name: {
              Thai: landmark.name,
              English: "",
            },
            Description: {
              Thai: landmark.description,
              English: ""
            },
            workshop: {
              name: workshopName,
              description: workshopDes,
              Name: {
                Thai: workshopName,
                English: ""
              },
              Description: {
                Thai: workshopDes,
                English: ""
              },
              workShop: landmark.workshop?.workShop || null, // Use existing value
              imageId: landmark.workshop?.imageId || "", // Use existing value
              startTime: landmark.workshop?.startTime || new Date(), // Default to current date or existing value
              endTime: landmark.workshop?.endTime || new Date(), // Default to current date or existing value

            },
            // Updating only the menu name and description, assuming it's a list of menus
            menu: landmark.menu?.map((menuItem) => ({
              // You can choose to keep existing fields or replace them as needed
              name: menuItem.name,
              description: menuItem.description,
              Name: {
                Thai: menuItem.name,
                English: ""
              },
              Description: {
                Thai: menuItem.description,
                English: ""
              },
              imageId: menuItem.imageId || "", // Use existing value or leave blank
            }))
          },
        });
      })
    );

    res.status(201).send({ success: true, data: landmarks });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
  }
}
//In development
export const DeleteId = async (req: Request, res: Response) => {
  try {
    const { landmarkId } : { landmarkId : string } = req.body;
    const landmark = await Landmark.delete({
      where: {
        id: landmarkId,
      },
    });

    //Clear Interacted
    const interact = await LandMarkInteract.findMany();
    for(let i = 0;i < interact.length;i++)
    {
      if(interact[i].id == landmarkId)
      {
        
      }
    }

    //Clear CheckIn


    //Clear Player Collection
    res.status(200).send({ success: true, data: landmark });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const UpdateId = async (req: Request, res: Response) => {
  try {
    const landmark = await Landmark.update({
      where: {
        id: req.params.id

      },
      data: req.body,
    });

    res.status(201).send({ success: true, data: landmark });
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

export const UpdateDetail = async (req: Request, res:Response ) => {
  try
  {
    const { landMarkId, name, description, imageId, ticketId  }: 
        { 
          landMarkId: string,
          name: LocalizationString,
          description: LocalizationString,
          imageId: string,
          ticketId: string,
        } = req.body;
        
    const landmark = await Landmark.findFirst({
        where: { id: landMarkId }
    });

    if (!landmark) {
      return res.status(404).send({ success: false, message: "Landmark not found" });
    }
    
    await Landmark.update({
      where: {
        id: landMarkId,
      },
      data:{
        Detail: {
            push: {
                Name: name,
                Description: description,
                ImageURL: imageId,
                ticketId: ticketId,
                createAt: new Date()
            }
          }
        }
    });
    return res.status(200).send({ success: true });
  }
  catch(error)
  {
    console.log(error)
    return res.status(500).send({ success: false, error })
  }
}

export const TempUpdate = async (req: Request, res: Response) => {
  try {
    const landmarks = await Landmark.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        workshop: true,
        menu: true,
      },
    });

    for (const landmark of landmarks) {
      // Update from workshop details
      if (landmark.workshop) {
        await updateLandmarkDetail(landmark, "workshop",{
          name: landmark.workshop.Name,
          description: landmark.workshop.Name,
          imageURL: landmark.workshop.imageId,
          ticketId: landmark.workshop.workShop || null,
        });
      }

      // Update from menu details
      if (landmark.menu?.length) {
        const header = (landmark)
        await updateLandmarkDetail(landmark, "menu",{
          name: landmark.menu[0].Name,
          description: landmark.menu[0].Name,
          imageURL: landmark.menu[0].imageId,
          ticketId: null,
        });
      }
    }

    res.status(201).send({ success: true, data: landmarks });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error });
  }
};

// Helper function to update landmark details
async function updateLandmarkDetail(landmark: any,header: string ,detail: any) {
  await Landmark.update({
    where:{
      id: landmark.id
    },
    data: {
      Detail: {
        push: {
          HeaderName: {
            Thai: header,
            English:header
          },
          Name: {
            Thai: detail.name?.Thai,
            English: detail.name?.English,
          },
          Description: {
            Thai: detail.description?.Thai,
            English: detail.description?.English,
          },
          ImageURL: detail.imageURL,
          ticketId: detail.ticketId,
          createAt: new Date(),
        },
      },
    },
  });
}

