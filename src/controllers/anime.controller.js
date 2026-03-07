import mongoose from "mongoose";
import { Anime } from "../models/anime.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllAnime = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.query;
  const pipeline = [];

  if (query) {
    pipeline.push({
      $match: {
        title: {
          $regex: query,
          $options: "i",
        },
      },
    });
  }

  if (sortBy && sortType) {
    pipeline.push({
      $sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
    });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  const options = {
    page: parseInt(page, 10),
    limit: Math.min(50, parseInt(limit, 10)),
    customLabels: {
      docs: "animes",
      totalDocs: "totalAnimes",
    },
  };

  const result = await Anime.aggregatePaginate(
    Anime.aggregate(pipeline),
    options
  );

  if (!result) {
    throw new ApiError(500, "Something went wrong while fetching animes!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Animes fetched successfully"));
});

const getAnimeById = asyncHandler(async (req, res) => {
  const { animeId } = req.params;

  if (!mongoose.isValidObjectId(animeId)) {
    throw new ApiError(400, "Invalid Anime ID format");
  }

  const anime = await Anime.findById(animeId);

  if (!anime) {
    throw new ApiError(404, "Anime not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, anime, "Anime fetched successfully"));
});

export { getAllAnime, getAnimeById };
