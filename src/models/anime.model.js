import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const animeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true,
    },
    studio: {
      type: String,
      default: "Unknown Studio",
      trim: true,
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["Airing", "Completed", "Upcoming"],
      default: "Airing",
    },
    episodes: {
      type: Number,
      default: 12,
    },
  },
  { timestamps: true }
);

animeSchema.index({ createdAt: -1 });

animeSchema.plugin(mongooseAggregatePaginate);

export const Anime = mongoose.model("Anime", animeSchema);
