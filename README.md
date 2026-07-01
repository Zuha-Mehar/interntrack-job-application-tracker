# InternTrack – Smart Job Application Tracker

InternTrack is a full-stack job application tracking platform that helps users manage internships and job applications in one organized dashboard.

Users can track applications, update statuses, manage which resume was used for each company, upload secure resume PDFs, view analytics, export CSV data, and organize their job search process efficiently.

## Live Demo

```text
https://interntrack-job-application-tracker.vercel.app
```

## GitHub Repository

```text
https://github.com/Zuha-Mehar/interntrack-job-application-tracker
```

## Features

- User authentication with Clerk
- User-specific job application data
- Add, edit, delete, and manage applications
- Track application status:
  - Applied
  - Shortlisted
  - Interview
  - Offer
  - Rejected
- Kanban-style application tracking
- Resume Used field for each company
- Secure resume PDF upload using Vercel Blob
- Private resume PDF viewing through authenticated API routes
- Delete resume PDFs when applications are removed
- Dashboard statistics
- Skill insights from applications
- Reminders for interviews, deadlines, and follow-ups
- Global application search
- CSV export with resume details
- Responsive dark UI

## Tech Stack

### Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Neon Database

### Authentication

- Clerk

### File Storage

- Vercel Blob

### Deployment

- Vercel

## Main Pages

- Landing Page
- Sign In
- Sign Up
- Dashboard
- Applications
- Add Application
- Edit Application
- Kanban Board
- Reminders
- Skills
- Analytics
- Settings

## Database Model

The main `Application` model stores:

- Company name
- Role
- Status
- Applied date
- Skills
- Resume used
- Resume file name
- Resume PDF URL
- Job link
- Notes
- User ID

## Project Highlights

- Built a real full-stack application using Next.js, TypeScript, PostgreSQL, Prisma, Clerk, and Vercel Blob.
- Implemented authentication and user-specific data so each user can manage their own applications privately.
- Added secure resume PDF uploads with private Blob storage and authenticated resume viewing.
- Created CRUD operations, protected API routes, CSV export, search, analytics, skill insights, and responsive UI.
- Removed demo data so the deployed app works like a real production-ready job tracker.

## Why I Built This

As a Computer Science graduate applying for internships and entry-level roles, I wanted to build a practical project that solves a real problem: keeping track of job applications, resumes, interview status, and follow-ups in one place.

This project demonstrates full-stack development, authentication, database management, secure file uploads, API route handling, and responsive UI design.

## Future Improvements

- Drag-and-drop Kanban cards
- Email reminders
- AI-based resume matching
- Job description skill extraction
- Interview preparation notes
- Application success rate insights
- Resume version management

## Author

Built by Zuha Mehar.