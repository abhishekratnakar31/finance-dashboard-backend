# Finance Dashboard Backend

A robust and scalable backend for a Finance Dashboard application, built with **Fastify**, **Prisma**, and **TypeScript**. This API provides comprehensive financial management features, including user authentication, expense/income tracking, and deep insights through dashboard summaries.

## 🚀 Features

- **User Management**: Secure registration and login with JWT-based authentication.
- **Role-Based Access Control (RBAC)**: Supports roles like `ADMIN`, `ANALYST`, and `VIEWER`.
- **Financial Records**: Full CRUD operations for income and expense records.
- **Soft Deletes**: Records are never permanently deleted, allowing for data recovery and audit trails.
- **Dashboard Analytics**:
  - Summary of total income and expenses.
  - Category-based breakdowns.
  - Monthly trends and recent activity insights.
- **API Documentation**: Interactive Swagger/OpenAPI documentation.
- **Robust Validation**: Input validation using **Zod**.
- **Modern Tech Stack**: ESM-first, Type-safe with TypeScript, and high-performance with Fastify.

## 🛠️ Tech Stack

- **Framework**: [Fastify](https://www.fastify.io/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (via [libsql](https://github.com/tursodatabase/libsql-client-ts))
- **Language**: TypeScript
- **Authentication**: JWT (@fastify/jwt) & bcrypt
- **Validation**: Zod
- **Testing**: Jest & Supertest
- **Documentation**: Swagger (@fastify/swagger)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## ⚙️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd finance-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your configurations:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your_secure_jwt_secret"
   PORT=3000
   ```

4. **Database Initialization:**
   Generate the Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Database Studio (Optional):**
   To visually explore and manage your database:
   ```bash
   npx prisma studio
   ```

## 🏃 Running the Application

### Development Mode

Runs the server with hot-reloading:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

### Testing

Run the test suite:

```bash
npm run test
```

## 📖 API Documentation

Once the server is running, you can access the interactive API documentation (Swagger UI) at:
[http://localhost:3000/docs](http://localhost:3000/docs)

### Core Endpoints

| Category      | Method | Endpoint                    | Description                           |
| :------------ | :----- | :-------------------------- | :------------------------------------ |
| **Auth**      | POST   | `/auth/register`            | Register a new user                   |
| **Auth**      | POST   | `/auth/login`               | Login and receive JWT                 |
| **Records**   | GET    | `/records`                  | List financial records (with filters) |
| **Records**   | POST   | `/records`                  | Create a new financial record         |
| **Records**   | PATCH  | `/records/:id`              | Update a record                       |
| **Records**   | DELETE | `/records/:id`              | Soft delete a record                  |
| **Dashboard** | GET    | `/dashboard/summary`        | Overall financial summary             |
| **Dashboard** | GET    | `/dashboard/monthly-trends` | Monthly income/expense trends         |

## 📂 Project Structure

```text
├── prisma/               # Database schema and migrations
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth and validation middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic & DB interaction
│   ├── types/            # TypeScript interfaces/types
│   ├── utils/            # Helper functions
│   ├── app.ts            # Fastify app setup
│   └── server.ts         # Entry point
├── jest.config.cjs       # Testing configuration
└── package.json          # Project metadata and dependencies
```

## 📄 License

This project is licensed under the ISC License.
