import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addReview = asyncHandler(async (req, res) => {
  const { animeId } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.isValidObjectId(animeId)) {
    throw new ApiError(400, "Invalid Anime ID");
  }

  if (!rating || !comment) {
    throw new ApiError(400, "Rating and comment both are required");
  }

  const review = await Review.create({
    animeId,
    userId: req.user._id,
    rating,
    comment,
  });

  if (!review) {
    throw new ApiError(500, "Something went wrong while adding the review");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully"));
});

const getAnimeReviews = asyncHandler(async (req, res) => {
  const { animeId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(animeId)) {
    throw new ApiError(400, "Invalid Anime ID");
  }

  const pipeline = [
    {
      $match: {
        animeId: new mongoose.Types.ObjectId(animeId),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "reviewer",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$reviewer",
    },
  ];

  const options = {
    page: parseInt(page, 10),
    limit: Math.min(50, parseInt(limit, 10)),
    customLabels: {
      docs: "reviews",
      totalDocs: "totalReviews",
    },
  };

  const result = await Review.aggregatePaginate(
    Review.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Reviews fetched successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.isValidObjectId(reviewId)) {
    throw new ApiError(400, "Invalid Review ID");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to update this review");
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  await review.save();

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!mongoose.isValidObjectId(reviewId)) {
    throw new ApiError(400, "Invalid Review ID");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You don't have permission to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export { addReview, getAnimeReviews, updateReview, deleteReview };
