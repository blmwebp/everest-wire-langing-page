# Everest Cables & Connectors website

Responsive React/Vite frontend with an Express API and PostgreSQL inquiry storage.

## Requirements

- Node.js 20+
- Docker Desktop with Compose, or a local PostgreSQL 16+ server

## Start locally

1. Copy `.env.example` to `.env` with `Copy-Item .env.example .env` in PowerShell.
2. Start PostgreSQL with `docker compose up -d database`.
3. Install packages with `npm install`.
4. Create the inquiry table: `Get-Content .\server\schema.sql | docker compose exec -T database psql -U postgres -d everest`
5. Start both applications with `npm run dev`.

Vite runs at `http://localhost:5173` and proxies `/api` requests to Express on port `4000`. For a production-style run, use `npm run build` and then `npm start`; Express serves the built frontend and API on port `4000`.

Inquiry submissions require PostgreSQL and the schema above. Quote specifications accept PDF, JPG or PNG files up to 5 MB; uploaded files are stored in PostgreSQL with the inquiry. Set `DATABASE_URL` and, when required by the hosting provider, `DATABASE_SSL=true`.

## Content and brand assets still needed

The current workspace did not include the supplied Everest logo, certification artwork or certificates, approved leadership photograph/names, product photographs, technical specification sheets, or verified CHARGECORE+ details. The interface therefore uses a text-only company name and product illustrations rather than recreating the missing logo or asserting unverified ratings, certificate identifiers, historical dates or leadership details. Replace the text label and temporary visual assets with approved Everest source files before launch.

For go-live, also confirm the product-specific scope of standards, exact certification claims, current document downloads, and the quote-response commitment.
