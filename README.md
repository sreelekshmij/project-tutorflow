# TutorFlow

TutorFlow is a lightweight multi-role web platform designed for **one-to-one online tutors** to manage students, schedule learning sessions, maintain session notes, and track student progress.

The application provides separate experiences for **Tutors** and **Students**, with role-based authentication and protected access to their respective features.

The project was built as a full-stack application using **React, Node.js, Express.js, and Supabase PostgreSQL**.

---

## Live Demo

**Frontend:**
`https://project-tutorflow.vercel.app`

**Backend API:**
`https://project-tutorflow.onrender.com`

---

## What This Project Does

TutorFlow allows tutors to manage their complete tutoring workflow from a single platform.

A tutor can:

* Create and manage student profiles
* Store student learning goals and weak areas
* Schedule one-to-one sessions
* Prevent double-booking for the same tutor
* Track session status
* Take notes during live sessions
* Automatically save session notes while typing
* Record student progress
* View session history for each student

Students can:

* View upcoming sessions
* View completed sessions
* Read completed session notes
* Access assigned homework when available

The application is also designed with AI-powered learning features in mind, which can be integrated into the platform later.

---

# Key Features

## Authentication & Authorization

* JWT-based authentication
* Secure password hashing using bcrypt
* Role-based access control
* Tutor and student roles
* Protected routes
* Authenticated API requests
* Persistent login using local storage

### Roles

| Role    | Access                                 |
| ------- | -------------------------------------- |
| Tutor   | Manage students, sessions and progress |
| Student | View sessions, notes and homework      |

Students are created by tutors rather than through the public signup flow.

---

## Tutor Features

### Student Management

Tutors can:

* Create students
* View all students
* View individual student profiles
* Edit student information
* Delete students
* Store:

  * Subject
  * Current level
  * Learning goals
  * Weak areas

### Session Management

Tutors can:

* Schedule sessions
* Select a student
* Set date and time
* Add a session topic
* View session history
* Edit scheduled sessions
* Start a session
* Complete a session
* Add live session notes
* View session details

### Session Status

Sessions follow a controlled lifecycle:

```text
scheduled
    ↓
in_progress
    ↓
completed
    ↓
ai_reviewed
```

Invalid status transitions are prevented by the backend.

### Live Session Notes

During an active session, tutors can enter notes.

Notes are automatically saved after a short debounce period, helping prevent data loss if the browser tab is closed or refreshed.

### Student Progress

Tutors can record:

* Topic
* Score
* Notes
* Associated session

Progress entries are displayed as a timeline for each student.

---

# Student Features

Students have access to a separate student portal.

### Student Dashboard

Students can view:

* Upcoming sessions
* Session date and time
* Session topics
* Session status

### Completed Sessions

Students can view completed sessions and read their session notes.

Completed session information is read-only for students.

### Homework

The homework section is designed to display AI-generated homework assignments after the AI features are integrated.

---

# Planned AI Features

The application architecture is designed to support AI-powered learning workflows.

Planned features include:

### Pre-session AI Plan

Before a session, AI can generate:

* Learning objectives
* Four-point lesson outline
* Three practice questions

### Post-session AI Debrief

After a session, AI can generate:

* Session summary
* 2–3 homework tasks
* Focus for the next session

### Progress Summary

AI can analyze a student's progress and generate a summary highlighting:

* Strengths
* Weak areas
* Improvement trends
* Recommended focus areas

These features can be integrated using an AI API such as OpenAI after the core application workflow is complete.

---

# Tech Stack

## Frontend

* React
* React Router
* React Hook Form
* Yup
* Axios
* SCSS Modules
* React Hot Toast

## Backend

* Node.js
* Express.js
* JWT
* bcrypt
* Joi
* Helmet
* CORS

## Database

* Supabase
* PostgreSQL
* JSONB for AI-generated data

## Deployment

* Vercel — Frontend
* Render — Backend API
* Supabase — Database

---

# Project Architecture

This project uses a monorepo structure.

```text
tutorflow/
│
├── api/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# Database Structure

The application uses PostgreSQL through Supabase.

Main tables:

```text
profiles
    │
    ├── students
    │       │
    │       ├── sessions
    │       │
    │       └── progress
    │
    └── sessions
```

### Profiles

Stores authentication and basic user information.

```text
id
full_name
email
password_hash
role
created_at
```

### Students

Stores student-specific learning information.

```text
id
profile_id
tutor_id
subject
current_level
learning_goals
weak_areas
created_at
updated_at
```

### Sessions

Stores scheduled and completed learning sessions.

```text
id
tutor_id
student_id
scheduled_at
topic
status
notes
ai_plan
ai_summary
ai_homework
ai_next_focus
created_at
updated_at
```

### Progress

Stores student learning progress.

```text
id
student_id
session_id
topic
score
notes
created_at
```

---

# Test Credentials

The following credentials can be used to test the application.

## Tutor Account

```text
Email: testtutor@yopmail.com
Password: Test@1234
```

Tutor account allows access to:

* Tutor Dashboard
* Students
* Sessions
* Progress

---

## Student Account

```text
Email: teststu1@yopmail.com
Password: Test@1234
```

Student account allows access to:

* Student Dashboard
* Upcoming Sessions
* Completed Sessions
* Homework

---

# Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/sreelekshmij/project-tutorflow.git
cd tutorflow
```

---

# Backend Setup

Navigate to the API directory:

```bash
cd api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_jwt_secret
```

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:8080
```

---

# Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Start the React application:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

---

# API Routes

## Authentication

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
```

## Students

```text
POST   /api/students
GET    /api/students
GET    /api/students/:studentId
PATCH  /api/students/:studentId
DELETE /api/students/:studentId
```

## Sessions

```text
POST   /api/sessions
GET    /api/sessions
GET    /api/sessions/:sessionId
PATCH  /api/sessions/:sessionId
PATCH  /api/sessions/:sessionId/status
PATCH  /api/sessions/:sessionId/notes
```

## Progress

```text
POST   /api/progress
GET    /api/progress/:studentId
```

## Student Portal

```text
GET    /api/student-portal/sessions/upcoming
GET    /api/student-portal/sessions/completed
GET    /api/student-portal/homework
```

---

# Security

The application includes several basic security measures:

* Passwords are hashed using bcrypt
* JWT authentication
* Role-based authorization
* Protected backend routes
* Ownership checks for tutor resources
* Helmet for HTTP security headers
* CORS configuration
* Environment variables for sensitive configuration
* Service role credentials are kept on the backend

Sensitive environment variables should **never be committed to GitHub**.

---

# Deployment

The project is deployed using separate frontend and backend services.

```text
                    ┌──────────────────┐
                    │      Vercel      │
                    │     Frontend     │
                    └────────┬─────────┘
                             │
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │      Render      │
                    │   Node/Express   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Supabase     │
                    │    PostgreSQL    │
                    └──────────────────┘
```

The frontend communicates with the deployed Express API, which handles authentication, authorization, business logic and database operations.

---

# Testing the Application

A recommended testing flow is:

### Tutor

1. Login as tutor
2. Create a student
3. Open the student profile
4. Add learning goals and weak areas
5. Schedule a session
6. Open the session
7. Start the session
8. Add session notes
9. Verify notes are automatically saved
10. Complete the session
11. Add progress for the student
12. Check the student's session history

### Student

1. Login as student
2. View upcoming sessions
3. Open completed sessions
4. Read session notes
5. Check the homework section

---

# Responsive Design

The frontend is designed to work across:

* Desktop
* Tablet
* Mobile

Tables and larger content sections include responsive handling for smaller screens.

---

# Project Goals

The main goals of this project were to build:

* A clean full-stack architecture
* Role-based authentication
* Secure REST APIs
* Proper database relationships
* Protected resources
* A practical tutor workflow
* Autosaving session notes
* A foundation for AI-powered education features

The application was developed with maintainability and future feature expansion in mind.

---

# Future Improvements

Possible future improvements include:

* AI-generated lesson plans
* AI session summaries
* AI-generated homework
* AI progress analysis
* Email notifications
* Calendar integration
* Real-time session collaboration
* Tutor analytics dashboard
* Student performance charts
* Automated reminders
* More granular permissions
* Automated API and frontend testing

---

# Author

**Sreelekshmi J**

MERN Stack Developer

Built using:

**React • Node.js • Express.js • PostgreSQL • Supabase • JWT • SCSS**
