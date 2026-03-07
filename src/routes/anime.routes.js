import { Router } from "express";
import { getAllAnime, getAnimeById } from "../controllers/anime.controller.js";

const router = Router();

router.route("/").get(getAllAnime);
router.route("/:animeId").get(getAnimeById);

export default router;
