# School Library Management API

A production-ready RESTful API for managing a school library system built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express v5
- **Database**: MongoDB + Mongoose v9
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/librarymanager.git
cd librarymanager

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## Environment Variables

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/librarymanager
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
```

---

## Authentication & Roles

All protected routes require a Bearer token in the `Authorization` header.

| Role        | Access                       |
| ----------- | ---------------------------- |
| `student`   | View books and own profile   |
| `attendant` | Full access to all resources |

---

## API Endpoints

### Auth

| Method | Endpoint                          | Auth |
| ------ | --------------------------------- | ---- |
| POST   | `/api/v1/auth/register/student`   | None |
| POST   | `/api/v1/auth/register/attendant` | None |
| POST   | `/api/v1/auth/login`              | None |

### Books

| Method | Endpoint                       | Auth      |
| ------ | ------------------------------ | --------- |
| GET    | `/api/v1/books`                | Any       |
| POST   | `/api/v1/books`                | Attendant |
| POST   | `/api/v1/books/bulk`           | Attendant |
| GET    | `/api/v1/books/:bookId`        | Any       |
| PUT    | `/api/v1/books/:bookId`        | Attendant |
| DELETE | `/api/v1/books/:bookId`        | Attendant |
| POST   | `/api/v1/books/:bookId/borrow` | Attendant |
| POST   | `/api/v1/books/:bookId/return` | Attendant |

### Authors

| Method | Endpoint                    | Auth      |
| ------ | --------------------------- | --------- |
| GET    | `/api/v1/authors`           | Any       |
| POST   | `/api/v1/authors`           | Attendant |
| POST   | `/api/v1/authors/bulk`      | Attendant |
| GET    | `/api/v1/authors/:authorId` | Any       |
| PUT    | `/api/v1/authors/:authorId` | Attendant |
| DELETE | `/api/v1/authors/:authorId` | Attendant |

### Students

| Method | Endpoint                      | Auth      |
| ------ | ----------------------------- | --------- |
| GET    | `/api/v1/students`            | Attendant |
| POST   | `/api/v1/students/bulk`       | Attendant |
| GET    | `/api/v1/students/:studentId` | Any       |
| PUT    | `/api/v1/students/:studentId` | Any       |
| DELETE | `/api/v1/students/:studentId` | Attendant |

### Attendants

| Method | Endpoint                          | Auth      |
| ------ | --------------------------------- | --------- |
| GET    | `/api/v1/attendants`              | Attendant |
| POST   | `/api/v1/attendants/bulk`         | Attendant |
| GET    | `/api/v1/attendants/:attendantId` | Attendant |
| PUT    | `/api/v1/attendants/:attendantId` | Attendant |
| DELETE | `/api/v1/attendants/:attendantId` | Attendant |

---

## Security Features

- JWT authentication with role-based access control
- Password hashing with bcryptjs
- Rate limiting — 100 requests per 15 minutes
- Secure HTTP headers with Helmet
- Input validation and sanitization on all routes
- Request body limited to 10kb

---

## Author

Gladstone Delali — TS Academy, Backend Development, Phoenix Cohort
