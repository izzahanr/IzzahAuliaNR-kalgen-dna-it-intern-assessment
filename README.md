# Biopharma IT Intern Assessment

A fullstack application implementing a CRUD dashboard integrated with the Kalbe Biopharma Feature and Authentication API, coupled with a secondary .NET backend for activity logging.

## Tech Stack
- **Frontend**: Next.js 14 App Router, TypeScript, Vanilla CSS (No Tailwind).
- **Logging Backend**: ASP.NET Core 8 Web API, Entity Framework Core, SQLite.

## Architecture & Security
1. **Frontend Authentication**: Next.js uses an API Route Proxy (`/api/auth/login`) to exchange user credentials for an Access Token from the Kalbe API. The token is stored securely in an **HTTP-Only Cookie**.
2. **Server Actions**: All CRUD operations (Create, Update, Delete) are handled entirely via Next.js Server Actions, keeping the API keys securely on the server.
3. **Dual Action**: Every successful mutation triggers a secondary REST call to the internal ASP.NET Core logging API.

## Getting Started

### 1. Setup Logging Backend (.NET)
Ensure you have the .NET 8 SDK installed.
```bash
cd logging-api
dotnet build
dotnet run
```
*Note: SQLite database (`logs.db`) and tables are automatically generated on startup.*

### 2. Setup Web Application (Next.js)
Ensure you have Node.js (v18+) installed.
```bash
cd web
npm install
# Set your API keys in .env.local if not already present
npm run dev
```

### 3. Usage
- Open `http://localhost:3000`
- Login with your custom credentials:
  - **Username**: `izzahanr`
  - **Password**: `izzah123`
  *(Note: The system internally maps this to the official Kalbe testing account to fetch real API data while maintaining your personal profile).*
- Navigate between Dashboard, Master Trackers, and Lab Requests.
- Perform CRUD operations and verify that they reflect in the Kalbe API and the local `.NET SQLite` database.

## Design Highlights
- Professional "Corporate Ocean Blue" theme (`#1E40AF` & `#2563EB`) designed for high contrast, minimal eye strain, and a modern SaaS aesthetic.
- Reusable UI Components: `DataTable`, `Pagination`, `Modal`, `Toast`.
- Strict decoupling of Server Components (data fetching) and Client Components (interactivity).

---
*Developed for PT Kalgen DNA / Biopharma Division Assessment.*
