// import { Inventory } from "@/lib/prisma";
// import { Request, Response } from "express";
console.log("Hello World");

// export const addItem = async (req: Request, res: Response) => {
//   try {
//     const { userId, itemId } = req.params;
//     let inventory;
//     const itemExistsInInventory = await Inventory.findUnique({
//       where: {
//         userId: userId,
//         items: {
//           some: {
//             itemId: itemId,
//           },
//         },
//       },
//     });

//     if (itemExistsInInventory) {
//       inventory = await Inventory.update({
//         where: {
//           userId: userId,
//         },
//         data: {
//           items: {
//             updateMany: {
//               where: {
//                 itemId: itemId,
//               },
//               data: {
//                 amount: Number(req.query.amount),
//               },
//             },
//           },
//         },
//       });
//     } else {
//       inventory = await Inventory.update({
//         where: {
//           userId: userId,
//         },
//         data: {
//           items: {
//             push: { itemId: itemId, amount: Number(req.query.amount) },
//           },
//         },
//       });
//     }

//     res.status(201).send({ success: true, inventory });
//   } catch (error) {
//     res.status(500).send({ success: false, error });
//   }
// };

// export const UserItem = async (req: Request, res: Response) => {
//   try {
//     const amount = Number(req.query.amount) || 0;
//     const { userId, itemId } = req.params;

//     const existingItem = await Inventory.findUnique({
//       where: {
//         userId: userId,
//         items: {
//           some: {
//             itemId: itemId,
//           },
//         },
//       },
//       select: {
//         items: true,
//       },
//     });

//     if (existingItem) {
//       const Currentamoung =
//         existingItem.items.find((item) => item.itemId === itemId)?.amount || 0;
//       const newAmount = Currentamoung - amount;
//       await Inventory.update({
//         where: {
//           userId: userId,
//           items: {
//             some: {
//               itemId: itemId,
//               amount: { gt: 0 },
//             },
//           },
//         },
//         data: {
//           items: {
//             updateMany: {
//               where: {
//                 itemId: itemId,
//               },
//               data: {
//                 amount: newAmount,
//               },
//             },
//           },
//         },
//       });

//       if (newAmount === 0) {
//         //console.log("Delete");
//         await Inventory.update({
//           where: {
//             userId: userId,
//           },
//           data: {
//             items: {
//               set: existingItem?.items.filter((id) => id.itemId != itemId),
//             },
//           },
//         });
//       }
//     }

//     const inventory = await Inventory.findUnique({
//       where: { userId },
//       select: { items: true },
//     });

//     res.status(201).send({ success: true, inventory });
//   } catch (error) {
//     res.status(500).send({ success: false, error });
//   }
// };

// export const DeleteItem = async (req: Request, res: Response) => {
//   try {
//     const userId = "66180636af34a547eb37fa0a";
//     const itemId = "6617251055251216532fdb99";
//     let inventory;

//     const getInventory = await Inventory.findUnique({
//       where: {
//         userId: userId,
//       },
//       select: {
//         items: true,
//       },
//     });

//     inventory = await Inventory.update({
//       where: {
//         userId: userId,
//       },
//       data: {
//         items: {
//           set: getInventory?.items.filter((id) => id.itemId != itemId),
//         },
//       },
//     });

//     res.status(201).send({ success: true, inventory });
//   } catch (error) {
//     res.status(500).send({ success: false, error });
//   }
// };
