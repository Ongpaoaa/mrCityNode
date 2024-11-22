import express, { Router } from "express";
const router: Router = express.Router();
import * as leaderBoardController from "@/controller/board.controller";

router.route("/").get(leaderBoardController.GetLeaderBoard);

export const leaderBoardRouter: Router = router;
