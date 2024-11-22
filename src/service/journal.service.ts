import { Antique, AntiqueInteract, AntiqueNavigate, AntiqueUsed, Item, Landmark, User } from "@/lib/prisma";
import { collectStatus, TypeItem, AntiqueStatus } from "@prisma/client";

export const existedCollect = async (id: string, typeid: string, type: "landMark" | "item" ) => {
    const collected = await User.findUnique({
        where: { id: id },
    });


    const existed = collected?.collection[type].some((collect) => collect.id === typeid);
    return existed
}

//#region Landmark
export const existedCheckin = async (id: string, landMarkid: string) => {
    const user = await User.findUnique({
        where: {
            id: id,
            LandMarkCheckIn: {
                some: {
                    landMarkId: landMarkid
                }
            }
        },
    });

    return !!user
}

export const UpdateCollectionItem = async (id: string, itemid: string, status:AntiqueStatus) => {

    const existed = await existedCollect(id, itemid, "item");
    const item = await Antique.findFirst({
        where: {
            id: itemid       
        }
    });
    if(!existed)
    {
        await User.update({
            where: { id: id },
            data: {
                collection: {
                    update: {
                        item: {
                            push: {
                                id: itemid,
                                status: AntiqueStatus.Found
                            }
                        }
                    }
                }
            }
        });
    }
    else
    {
        console.log(itemid)
        await User.update({
            where: { id: id },
            data: {
              collection: {
                update: {
                  item: {
                    updateMany: {
                      where: {
                        id: itemid
                      },
                      data: {
                        status: status
                      }
                    }
                  }
                }
              }
            },
          });
    }
    

    return item
};

export const UpdateItemUsed = async (id: string, itemId: string) => {
    const usedItem = await User.update({
        where: { id: id },
        data: {
            ItemUsed: {
                create: {
                    itemId: itemId
                }
            }
        }
    });

    return !!usedItem
};

export const Find = async (id: string) => {
    const landMark = await Landmark.findUnique({
      where: { id: id }
    });
  
    return landMark;
};
//#endregion

//#region Antique
export const existedInteract = async (userId: string, antiqueId: string) => {
    
    const existed = await AntiqueInteract.findFirst({
        where:{
            userId: userId,
            antiqueId: antiqueId
        }
    })
    return existed;
};

export const existedUse = async (userId: string, antiqueId: string) => {
    
    const existed = await AntiqueNavigate.findFirst({
        where:{
            userId: userId,
            antiqueId: antiqueId
        }
    })
    return existed;
};

export const existedUsed = async (userId: string, antiqueId: string) => {
    
    const existed = await AntiqueUsed.findFirst({
        where:{
            userId: userId,
            antiqueId: antiqueId
        }
    })
    return existed;
};
//#endregion