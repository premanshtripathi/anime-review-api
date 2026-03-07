import { Router } from "express";
import {
  addReview,
  getAnimeReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/anime/:animeId").get(getAnimeReviews).post(verifyJWT, addReview);

router
  .route("/:reviewId")
  .patch(verifyJWT, updateReview)
  .delete(verifyJWT, deleteReview);

export default router;
