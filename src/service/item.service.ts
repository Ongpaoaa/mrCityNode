import { Item, UserItem, } from "@/lib/prisma";
import { findItemExisted } from "./user.service";

//return true if item expire
//return false if not
export const isExpired = async(itemID: string) => {
    let item = await Item.findFirst({
        where:
        {
            id : itemID,
        },
    });
    if(item && item.expireDate)
    {
        const now = new Date().getTime();
        const expire = item.expireDate.getTime();
        if(now > expire)
        {
            return true;
        }
    }
    return false;
}
export const deleteUserItem = async(userID: string, itemID: string) => {
    const userItemData = await findItemExisted(userID, itemID);
    await UserItem.delete({
        where:
        {
            id: userItemData?.id,
        }
    })
}