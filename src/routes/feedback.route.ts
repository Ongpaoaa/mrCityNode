import express, { Router } from "express";
import * as FeedbackController from "@/controller/feedback.controller";
const router: Router = express.Router();

router
    .route("/")
    .get(FeedbackController.GetFeedBackQuestion)
    .post(FeedbackController.CreateFeedBack);


router

export const FeedbackRouter : Router = router;