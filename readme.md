# Anime Review API

A robust, production-ready RESTful API for managing anime titles and user reviews. Built with Node.js, Express, and MongoDB, this project demonstrates complex aggregation pipelines, relational data handling, and optimized pagination.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Architecture:** MVC Pattern (Models, Views/Routes, Controllers)
- **Utilities:** `mongoose-aggregate-paginate-v2` for high-performance pagination, custom `ApiError` & `ApiResponse` classes for standardized error handling.

## ✨ Key Features

- **JWT Authentication:** Secure user registration, login, and route protection.
- **Anime Management:** Advanced search, sorting, and paginated fetching of anime data using MongoDB aggregation.
- **Review System:** Full CRUD capabilities for user reviews. Uses `PATCH` for precise partial updates and `$lookup` for relational data mapping (User + Anime).
- **Database Seeding:** Automated script integrated with the public Jikan API to instantly populate the database with real-world anime data and mock reviews.

## 💻 Local Setup & Installation

**1. Clone the repository**

```bash
git clone https://github.com/premanshtripathi/anime-review-api.git
cd anime-review-api
```

---

**2. Install Dependencies**

```bash
npm install
```

---

**3. Set up Environment Variables:**
Follow .env.sample to setup your environment variables in .env file in root folder

---

**4. Seed the Database (Highly Recommended):**

To test the API effectively, you need initial data.

**Note:** Ensure you have started the server and registered at least one user via Postman (POST /api/v1/users/register) before running this script.

```bash
node seed.js
```

---

**5. Start the Server**

Run the application in development mode (uses nodemon):

```bash
npm run dev
```

If successful, you will see ⚙️ Server is running at port : 8000 in your terminal!

---

# 📚 API Documentation

Base URL: `http://localhost:8000/api/v1` (or your configured port/domain)

---

## 👤 1. User Authentication

| Method | Endpoint          | Description                         | Request Body                                                                  | Auth Required |
| :----- | :---------------- | :---------------------------------- | :---------------------------------------------------------------------------- | :-----------: |
| `POST` | `/users/register` | Register a new user                 | `{ "fullname": "...", "username": "...", "email": "...", "password": "..." }` |      ❌       |
| `POST` | `/users/login`    | Login and get access/refresh tokens | `{ "email": "...", "password": "..." }`                                       |      ❌       |

---

## 🎬 2. Anime Operations

| Method | Endpoint          | Description                                           | Query Parameters                                                                                                                   | Auth Required |
| :----- | :---------------- | :---------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :-----------: |
| `GET`  | `/anime`          | Fetch all animes with pagination, search, and sorting | `page` (default: 1)<br>`limit` (default: 10)<br>`query` (e.g., "solo")<br>`sortBy` (e.g., "title")<br>`sortType` ("asc" or "desc") |      ❌       |
| `GET`  | `/anime/:animeId` | Fetch details of a single anime by its MongoDB ID     | None                                                                                                                               |      ❌       |

---

## ⭐ 3. Review Operations

| Method   | Endpoint                  | Description                                | Request Body / Parameters                                                                | Auth Required |
| :------- | :------------------------ | :----------------------------------------- | :--------------------------------------------------------------------------------------- | :-----------: |
| `GET`    | `/reviews/anime/:animeId` | Get paginated reviews for a specific anime | **Query:** `page`, `limit`<br>**Params:** `animeId`                                      |      ❌       |
| `POST`   | `/reviews/anime/:animeId` | Add a new review to an anime               | **Params:** `animeId`<br>**Body:** `{ "rating": 9, "comment": "Amazing!" }`              |     ✅ 🔐     |
| `PATCH`  | `/reviews/:reviewId`      | Partially update an existing review        | **Params:** `reviewId`<br>**Body:** `{ "rating": 10 }` _(Send only what needs updating)_ |     ✅ 🔐     |
| `DELETE` | `/reviews/:reviewId`      | Delete a review                            | **Params:** `reviewId`                                                                   |     ✅ 🔐     |

---

## 🔐 Authentication Details

For protected routes (marked with ✅ 🔐), you must include the JWT Access Token in the request headers:

**Header Format:**

```http
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```
