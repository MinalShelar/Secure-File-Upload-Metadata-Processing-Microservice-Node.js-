Secure File Upload Microservice - Assignment Submission

1. Project Structure & Code Overview

file-upload-service/
│
├─ controllers/
│    ├─ authController.js
│    ├─ fileController.js
│
├─ middlewares/
│    └─ authMiddleware.js
│
├─ models/
│    └─ index.js
│
├─ routes/
│    ├─ authRoutes.js
│    ├─ fileRoutes.js
│
├─ services/
│    ├─ authService.js
│    ├─ fileService.js
│
├─ uploads/                # Uploaded files storage folder
├─ worker.js               # Background job worker processing files
├─ app.js                  # Express app server entry point
├─ .env                    # Environment variables
├─ Database.txt            # Database Script
├─ README.md               
├─ package.json

2. README.md

# Secure File Upload & Processing Microservice

## Overview

This microservice allows authenticated users to upload files along with metadata, stores file info in a PostgreSQL database, and processes files asynchronously using BullMQ and Redis. The service uses JWT-based authentication to secure endpoints.

---

## Tech Stack

- Node.js (v18+)
- Express.js
- PostgreSQL (via Sequelize ORM)
- Redis + BullMQ for background job queue
- JWT for authentication
- Multer for file uploads

---

## Setup and Run Locally

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Redis server
- Git (optional)

### Clone the repo

```bash
git clone <repo-url>
cd file-upload-service

### Install dependencies

RUN - npm install

### Configure environment variables 

PORT=4000
JWT_SECRET=***
DATABASE_HOST=localhost
DATABASE_NAME=***
DATABASE_USER=***
DATABASE_PASSWORD=***
REDIS_HOST=localhost
REDIS_PORT=6379

### Initialize Database
Ensure PostgreSQL is running and the database is created.Run Sequelize sync:

RUN - node app.js
(This will create tables based on models automatically, Or you can create in database also I already provide Database.txt file where I provided database script).

### Seed a Test User (optional)
Create a seed script or add users manually. Example seed file creates a user:

RUN - node seed.js

### Run the Server
Start the Express API server:

RUN - node app.js

### Start the background worker (in another terminal):

RUN - node worker.js

### API Documentation

1) API :- Authentication
METHOD & URL :- POST /auth/login

Request JSON:
{
  "email": "testuser@example.com",
  "password": "Password123"
}
Response:
{
  "token": "jwt_token_here"
}

2) API :- Upload File
METHOD & URL :- POST /upload

Headers:

Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
Form fields:

file (required): file to upload

title (optional): string

description (optional): string

Response:

{
  "fileId": 1,
  "status": "uploaded"
}


3) API :- Get File Status
METHOD & URL :- GET /files/:id (fileId)

Headers:

Authorization: Bearer <jwt_token>
Response:

{
  "id": 1,
  "original_filename": "example.pdf",
  "title": "Sample File",
  "description": "Demo upload",
  "status": "processed",
  "extracted_data": "<sha256_hash>",
}

4) API :- Get Paginated Files List
METHOD & URL :- GET /files?page=1&limit=10

Headers:

Authorization: Bearer <jwt_token>
Response:

{
  "totalFiles": 37,
  "data": [
    {
      "id": 1,
      "original_filename": "file1.pdf",
      "title": "File 1",
      "description": "Description",
      "status": "processed",
      "extracted_data": "...",
    },
    ...
  ]
}

### Design Choices

1) Separation of concerns: Clear modular separation into routes, controllers, services, and middleware.

2) Security: JWT authentication with middleware protecting routes, user-based file access control.

3) Async processing: BullMQ + Redis used for robust background job management and status tracking.

4) Database: Sequelize ORM for PostgreSQL with associations reflecting users, files, and jobs.

5) File handling: Multer used for multipart/form-data uploads stored locally.

6) Pagination: Implemented efficient DB-level pagination using Sequelize's findAndCountAll.

### Known Limitations and Assumptions

1) Passwords stored hashed; no registration endpoint provided (users need to be seeded or created externally).

2) File storage is local disk (./uploads); production should use durable storage like S3.

3) No upload rate limiting or retry on failed jobs implemented (can be added).

4) Limited file size max 5MB to prevent abuse.

5) No Swagger or OpenAPI spec included.

6) No frontend/UI — backend only.

7) Token expiry sets for 1 hour.

8) To avoid given error -> "The file above is not in your working directory, and will be unavailable to your teammates when you share the request. 
You can either set up your working directory in Settings, or upload the file to Postman." (Whatever file wants to upload keep in working node project only)

### PostgreSQL Schema (via Sequelize models)

-users (id, email, password, created_at)

-files (id, user_id, original_filename, storage_path, title, description, status, extracted_data, uploaded_at)

-jobs (id, file_id, job_type, status, error_message, started_at, completed_at)

### Background Processor / Job Worker
-worker.js connects to Redis, listens for jobs on the file-processing queue, marks files as processing, simulates file processing (computes SHA256 hash), updates status to processed or failed accordingly.

Feel free to ask if you want full code files zipped or any other help!
