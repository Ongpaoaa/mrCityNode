import express, { Router } from "express";
import * as adminController from "@/controller/admin.controller";
const router: Router = express.Router();


router
     .route("/admin")
     .post(adminController.UpdateAdmin);
router
     .route("/allUser")
     .post(adminController.GetAllUser);
router
     .route("/user")
     .get(adminController.GetUser);
router
     .route("/item")
     .post(adminController.UpdateUserInventory);
router
     .route("/quest")
     .post(adminController.UpdateUserCurrentQuest);
router
     .route("/questProgress")
     .post(adminController.UpdateUserQuestProgress);
router
     .route("/")
     .get(adminController.GetAPPSetup)
     .post(adminController.CreateAdminSetUp);

router
     .route("/temp")
     .post(adminController.UpdateSetUp);

export const adminRouter : Router = router;