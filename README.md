# InternTrack – Smart Job Application Tracker

InternTrack is a modern job and internship application tracker built with Next.js, TypeScript, and Tailwind CSS. It helps users organize applications, track interview progress, manage reminders, analyze skills, and view job search performance through a clean dashboard.

## Features

* Landing page with modern SaaS-style UI
* Dashboard with application stats and reminders
* Add, edit, and delete job applications
* Kanban board for tracking application status
* Reminders for interviews, follow-ups, and deadlines
* Skills insights based on saved applications
* Analytics dashboard with response, interview, and offer rates
* Profile/settings page with local saved profile data
* Global application search
* Responsive sidebar for mobile and desktop
* Custom 404 page, loading page, favicon, and metadata

## Tech Stack

* Next.js
* TypeScript
* React
* Tailwind CSS
* Lucide React Icons
* LocalStorage for temporary data persistence

## Pages

* `/` – Landing page
* `/dashboard` – Main dashboard
* `/applications` – Applications list
* `/applications/add` – Add application form
* `/applications/[id]/edit` – Edit application form
* `/kanban` – Kanban board
* `/reminders` – Reminders page
* `/skills` – Skill insights
* `/analytics` – Analytics dashboard
* `/settings` – Profile and settings page

## How to Run Locally

```bash
npm install
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Project Purpose

This project was built as a resume-worthy full-stack-ready frontend project for students and freshers who want to track their internship or job search process in an organized way.

## Future Improvements

* Add backend API routes
* Add PostgreSQL database
* Add Prisma ORM
* Add authentication
* Add drag-and-drop Kanban functionality
* Add email reminders
* Add CSV export
* Deploy on Vercel

## Resume Description

Built InternTrack, a smart job application tracker using Next.js, TypeScript, and Tailwind CSS. Implemented application CRUD operations, Kanban status tracking, reminders, analytics, skill insights, profile settings, global search, responsive UI, and localStorage-based data persistence.
