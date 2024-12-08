import express, { Router } from "express";
const router: Router = express.Router();
import * as userController from "@/controller/user.controller";
import * as leaderboardController from "@/controller/board.controller";
import { authMiddleware } from "@/middleware/auth";

router
  .route("/").get(authMiddleware, userController.getUser);

router
  .route("/login")
  .post(userController.Login);

router
  .route("/name")
  .patch(authMiddleware, userController.CreateUserName); // create user name

router
  .route("/rename")
  .patch(authMiddleware, userController.Rename);

router
  .route("/language")
  .patch(authMiddleware, userController.UpdateLanguage);

router
  .route("/inventory")
  .get(authMiddleware, userController.GetUserInventory)
  .post(authMiddleware, userController.UpdateUserInventory);

router
  .route("/collection")
  .get(authMiddleware, userController.GetUserCollection)
  // .post(
  //   authMiddleware,
  //   validateZod(createUserCollectionSchema),
  //   userController.CreateUserCollection
  // );

router
  .route("/tutorial")
  .put(authMiddleware, userController.UpdateTutorialStep)

router
  .route("/tutorialbool")
  .patch(authMiddleware, userController.UpdateTutorialBoolean);

router
  .route("/completedquest")
  .get(authMiddleware, userController.GetUserCompletedQuest);

router
  .route("/currentQuest")
  .get(authMiddleware, userController.GetUserCurrentQuest)
  .post(authMiddleware, userController.UpdateCurrentQuest);

router
  .route("/progress").put(authMiddleware, userController.UpdateProgress);

router
  .route("/reward").post(authMiddleware, userController.UpdateReward);

router
  .route("/gacha")
  .post(authMiddleware, userController.UseGacha);

router
  .route("/rank")
  .get(authMiddleware, leaderboardController.GetUserRank);

router
  .route("/feedback")
  .post(authMiddleware, userController.AnswerQuestion);


export const userRoute: Router = router;
