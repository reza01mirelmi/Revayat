# Ravayat (روایت)

> A platform for sharing and discovering personal experiences — built with Node.js, TypeScript, and PostgreSQL.

🌐 **Live API:** https://revayat.onrender.com

---

## Features

- 🔐 JWT authentication (access + refresh tokens) with single active session per user
- 📝 Full post lifecycle — create, update, delete, filter by category/tag, related posts
- 💬 Comments with per-comment ownership control
- ❤️ Toggle-based likes and bookmarks
- 🏷️ Category and tag management with many-to-many post relations
- 🛡️ Role-based access control (User / Admin) on every protected route
- 📄 Consistent, bounded pagination across all list endpoints
- ✅ Input validation on every mutating request via Zod schemas

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Authentication | JWT (Access + Refresh Token) |
| Security | Helmet · CORS · Rate Limiting · bcrypt |

---

## Project Structure

```
src/
├── config/           # Database and environment config
├── errors/           # Custom AppError class
├── generated/        # Prisma generated client
├── middlewares/      # Auth, validation, rate limiting, param validation
├── modules/
│   ├── auth/         # Register, login, refresh, logout
│   ├── user/         # Profile, update, admin user management
│   ├── post/         # CRUD, search, filter, related posts
│   ├── category/     # Category management
│   ├── tag/          # Tag management
│   ├── comment/      # Nested comments on posts
│   ├── like/         # Toggle like on posts
│   └── bookmark/     # Save and manage bookmarks
├── routes/           # Central router
├── types/            # Global TypeScript type declarations
└── utils/            # JWT utilities
```

---

## Authentication

- **Access Token** — short-lived (15 min), returned in response body
- **Refresh Token** — long-lived (7 days), stored in `httpOnly` cookie and database
- **Single session** per user — logging in invalidates the previous session

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive tokens |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Logout and invalidate refresh token |
| GET | `/me` | Get current authenticated user |

### Users — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/:username` | Public | View user profile |
| GET | `/:username/posts` | Public | View user's posts |
| PATCH | `/me` | User | Update own profile |
| PATCH | `/me/password` | User | Change password |
| DELETE | `/me` | User | Deactivate own account |
| GET | `/me/bookmarks` | User | Get saved posts |
| GET | `/admin/users` | Admin | List all users |
| GET | `/admin/users/:id` | Admin | Get user details |
| PATCH | `/admin/users/:id/role` | Admin | Change user role |
| PATCH | `/admin/users/:id/ban` | Admin | Ban a user |
| PATCH | `/admin/users/:id/unban` | Admin | Unban a user |
| DELETE | `/admin/users/:id` | Admin | Delete a user |

### Posts — `/api/posts`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all published posts (paginated) |
| GET | `/:id` | Public | Get a single post |
| GET | `/category/:slug` | Public | Posts by category |
| GET | `/tag/:slug` | Public | Posts by tag |
| GET | `/:id/related` | Public | Related posts |
| POST | `/` | User | Create a new post |
| GET | `/me` | User | My posts |
| PATCH | `/me/:id` | User | Update own post |
| DELETE | `/me/:id` | User | Delete own post |
| GET | `/admin` | Admin | All posts (any status) |
| PATCH | `/admin/:id/status` | Admin | Change post status |
| DELETE | `/admin/:id` | Admin | Delete any post |

### Comments — `/api/posts/:postId/comments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get comments on a post |
| POST | `/` | User | Add a comment |
| PATCH | `/:id` | User | Edit own comment |
| DELETE | `/:id` | User | Delete own comment |
| DELETE | `/admin/comments/:id` | Admin | Delete any comment |

### Likes — `/api/posts/:postId`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/like` | User | Toggle like (like/unlike) |
| GET | `/likes` | Public | Get likes count and users |

### Bookmarks — `/api/posts/:postId`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/bookmark` | User | Toggle bookmark |

### Categories — `/api/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all categories |
| GET | `/:slug` | Public | Get category with posts |
| POST | `/admin/categories` | Admin | Create category |
| PATCH | `/admin/categories/:id` | Admin | Update category |
| DELETE | `/admin/categories/:id` | Admin | Delete category |

### Tags — `/api/tags`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all tags |
| GET | `/:slug` | Public | Get tag with posts |
| POST | `/admin/tags` | Admin | Create tag |
| PATCH | `/admin/tags/:id` | Admin | Update tag |
| DELETE | `/admin/tags/:id` | Admin | Delete tag |

---

## Setup

```bash
# 1. Clone the repository
https://github.com/reza01mirelmi/Revayat.git
cd ravayat

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Start development server
npm run dev
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
NODE_ENV=development
```

---

## License

MIT
