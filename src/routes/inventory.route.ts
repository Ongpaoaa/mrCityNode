import express, { Router } from "express";
const router: Router = express.Router();
// import * as inventoryController from "@/controller/inventory.controller";
import { authMiddleware } from "@/middleware/auth";

// router.route("/").post(authMiddleware, inventoryController.Create);
// router.route("/GetUserId/:id").get(inventoryController.GetUserId); Move to /users/inventory
// router.route("/:id").delete(inventoryController.DeleteId);
// router.route("/AddItem/:userId/:itemId").put(inventoryController.addItem);
// router.route("/UserItem/:userId/:itemId").put(inventoryController.UserItem);

export const inventory: Router = router;
