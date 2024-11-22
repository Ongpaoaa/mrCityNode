import express, { Router } from "express";
const router: Router = express.Router();
import * as questController from "@/controller/quest.controller";

router.route("/").get(questController.GetAll);
router.route("/:id").get(questController.GetId);
router.route("/").post(questController.Create);
router.route("/:id").delete(questController.Delete);
router.route("/:id").put(questController.Update);
router
    .route("/localize")
    .post(questController.UpdateLocalize);
// router
//   .route("/CurrentQuest/UserId/:userid/GetId/:questId")
//   .put(questController.GetCurrentQuest);
// router
//   .route("/GetReward/UserId/:userid")
//   .put(questController.GetReward);
// router.route("/UpdateProgress/:userid").put(questController.UpdateProgress)
export const questRouter: Router = router;
