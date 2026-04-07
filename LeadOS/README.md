# LeadOS

## Overview
LeadOS is an AI-powered sales assistant designed exclusively for local SMEs. It automates lead capture across web, inbound calls, and WhatsApp, generates intelligent follow-ups via GPT-4o, enables seamless managerial approval workflows, manages multi-channel scheduled posts natively via Buffer, and facilitates payments seamlessly via Razorpay. Built natively for scale, featuring robust enterprise Role-Based Access Controls and multi-tenant security layers.

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database & Supabase CLI
- OpenAI API Key
- Supported integrations (Twilio, Razorpay, Buffer)
- Logflare / Sentry for deep logging and runtime captures

## Local Setup
1. **Clone the repo**
   `git clone https://github.com/leados/core.git`
2. **Install Mono-Repo Dependencies**
   Navigate to `/backend` -> `npm install`
   Navigate to `/frontend` -> `npm install`
3. **Environment Setup**
   Copy `.env.example` and replace required keys.
4. **Bootstrapping**
   Terminal 1: `cd backend && npm run dev`
   Terminal 2: `cd frontend && npm run dev`

## Deploying
- **Frontend (Vercel):** Seamless integration configured pushing `frontend/` bounds. Ensure Vercel build output matches `/dist`.
- **Backend (Render):** Automatically builds Express instances connecting Postgres natively. 

## Running Migrations
Run DB structures locally navigating into SQL tools against Supabase connections targeting `backend/migrations/*.sql` natively in chronological order.

## Running Tests
Navigate to `/backend`
Run `npm run test` or `npx jest` to execute the Unit + Integration Jest frameworks.

## Environment Variables
See `.env.example` for comprehensive parameter specifications.

## Architecture Diagram
```
+----------------+      HTTP/REST      +-------------------+
|                | <-----------------> |                   |
|  React (Vite)  |                     |  Express Backend  |
|  Frontend UI   |                     |  (Node.js)        |
|                | <-------+           |                   |
+----------------+         |           +---------+---------+
                           |                     |
                           v                     v
                +-------------------+   +-------------------+
                | Third-Parties     |   | PostgreSQL DB     |
                | (OpenAI, Twilio,  |   | (Supabase RDS)    |
                | Razorpay, Buffer) |   +-------------------+
                +-------------------+
```
