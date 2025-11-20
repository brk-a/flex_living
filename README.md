# Flex Living Reviews Dashboard

A React + Node.js application that provides property reviews management and display for Flex Living. The system integrates mocked and real review data for performance insights, reviews moderation and property display.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Usage](#usage)
- [Available Backend API Endpoints](#available-backend-api-endpoints)
- [Google Reviews Integration Exploration](#google-reviews-integration-exploration)

---

## Features

- Managerial dashboard for filtering and managing property reviews
- Review approval system to select which reviews appear publicly
- Property detail pages replicating Flex Living’s style, with selected guest reviews
- Mocked Hostaway review data integration for testing
- Responsive, modern UI styled with Tailwind CSS

---

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- Vite for fast builds and hot reloading

### Backend
- Node.js with Express
- MongoDB with Mongoose ORM
- Environment variable configuration via `dotenv`

---

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn package manager
- MongoDB (Atlas cloud or local instance)
- Git for version control

---

## Environment Variables

Create `.env` files in the respective directories with these keys:

### Frontend (`frontend/.env`)
```
VITE_API_BASE=http://localhost:5000/api
```

### Backend (`backend/.env`)
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
HOSTAWAY_API_URL=your_hostaway_api_url
HOSTAWAY_ACCOUNT_ID=your_hostaway_account_id
HOSTAWAY_API_KEY=your_hostaway_api_key
```

Replace placeholders appropriately.

---

## Installation & Setup

Navigate to the project root:

```
cd flex_living_task
```

### Run the Frontend

Using `make`:

```
make start-frontend
```

Or manually using npm:

```
cd frontend/flex_living_ui
npm install
npm run dev
```

Access the frontend at `http://localhost:5173`.

### Run the Backend

Using `make`:

```
make start-backend
```

Or manually using npm:

```
cd backend
npm install
npm start
```

API will be available at `http://localhost:5000`.

### Run Tests

Using `make`:

```
make run-tests
```

### Clean up

Using `make`:

```
make clean
```

---

## Usage

Use the dashboard to filter, approve, and manage property reviews. View the property details page to see selected guest reviews displayed per property. Use the provided Makefile commands (see below) for development tasks.

---

## Available Backend API Endpoints

| Method | Path                          | Description                                      | Request Data                         | Response                         |
|--------|-------------------------------|------------------------------------------------|------------------------------------|----------------------------------|
| GET    | `/api/reviews/hostaway`        | Fetch reviews with optional filters             | Query params: rating, category, etc.| JSON `{ status, result: Review[] }`|
| POST   | `/api/reviews/selection`       | Mark review as selected/approved                 | JSON `{ reviewId, listingName }`    | JSON `{ status, message }`       |
| DELETE | `/api/reviews/selection/:id`   | Unmark a selected review                         | URL param: reviewId                 | JSON `{ status, message }`       |

---

## Google Reviews Integration Exploration

- Google Places API offers access to real Google Reviews data.
- Setup is complex: requires Google Cloud billing enabled, API key management, place ID discovery.
- API usage has quotas and limits that can impact reliability.
- Compliance demands reviews be shown unfiltered with branding, complicating moderation.
- Integration involves sync and caching strategies increasing project scope.
- Due to complexity and overhead, Google Reviews integration was deemed not feasible within current project timeline.
- Current system uses mocked and Hostaway reviews for consistent management.

---
