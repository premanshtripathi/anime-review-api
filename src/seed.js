import mongoose from "mongoose";
import dotenv from "dotenv";
import { Anime } from "../src/models/anime.model.js";
import { Review } from "../src/models/review.model.js";
import { User } from "../src/models/user.model.js";
import { DB_NAME } from "./constants.js";

dotenv.config({
  path: "./.env",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seedDatabase = async () => {
  try {
    console.log("⏳ Connecting to Database...");
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ DB Connected!");
    const user = await User.findOne();
    if (!user) {
      console.log(
        "❌ Koi user nahi mila DB mein! Pehle Postman se ek user register karo."
      );
      process.exit(1);
    }

    console.log("🧹 Clearing old data...");
    await Anime.deleteMany({});
    await Review.deleteMany({});

    console.log("🚀 Fetching 100 Animes from Jikan API...");
    let allAnimes = [];

    // 4 pages fetch karenge (25 per page = 100 animes)
    for (let page = 1; page <= 4; page++) {
      const response = await fetch(
        `https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`
      );
      const { data } = await response.json();

      const formatted = data.map((item) => ({
        title: item.title_english || item.title,
        studio:
          item.studios.length > 0 ? item.studios[0].name : "Unknown Studio",
        genres: item.genres.map((g) => g.name),
        status:
          item.status === "Currently Airing"
            ? "Airing"
            : item.status === "Finished Airing"
              ? "Completed"
              : "Upcoming",
        episodes: item.episodes || 12,
      }));

      allAnimes.push(...formatted);
      console.log(`✅ Page ${page} fetched! Waiting 2 seconds to avoid ban...`);
      await sleep(2000);
    }

    const insertedAnimes = await Anime.insertMany(allAnimes);
    console.log(`🎉 ${insertedAnimes.length} Animes inserted!`);

    console.log("📝 Generating 10,000 Reviews locally (100 per anime)...");
    const reviewsToInsert = [];
    const sampleComments = [
      "Absolute masterpiece!",
      "Pacing was a bit off, but great animation.",
      "Overrated in my opinion.",
      "The character development is insane.",
      "Peak fiction!",
      "Can't wait for the next season.",
      "Story is predictable but fun.",
      "Goat level anime.",
      "Visuals are stunning, MAPPA cooked.",
      "A decent watch.",
    ];

    for (let anime of insertedAnimes) {
      for (let i = 0; i < 100; i++) {
        reviewsToInsert.push({
          animeId: anime._id,
          userId: user._id, // Assigning to the user we found
          rating: Math.floor(Math.random() * 10) + 1, // Random rating 1-10
          comment:
            sampleComments[Math.floor(Math.random() * sampleComments.length)],
        });
      }
    }

    // Chunking the insert into 2 parts to avoid any memory limits
    console.log("💾 Pushing reviews to Atlas...");
    const half = Math.ceil(reviewsToInsert.length / 2);
    await Review.insertMany(reviewsToInsert.slice(0, half));
    await Review.insertMany(reviewsToInsert.slice(half));

    console.log(`🔥 10,000 Reviews inserted successfully!`);
    console.log("🏁 SEEDING COMPLETE! You are ready to rock.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
