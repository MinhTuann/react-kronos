> [!WARNING]
> LEGACY / DO NOT DEVELOP
>
> This repository is no longer the source of truth for Kronos.
> All new features, bug fixes, and releases must happen in `kronos-monorepo` on `main`.
> Keep this repo only as historical reference or emergency rollback material.

# Kronos Watch Store - Storefront (React)

This is the public storefront for the Kronos Watch Store system. The full system is split into three services:

- Storefront (this repo, public)
- CMS admin (private)
- Backend API (private)

The storefront consumes a public-safe shared contracts package published from the private Kronos source of truth.

## Architecture Overview

- Frontend: React + Vite
- API: Node/Express backend (private repo)
- CMS: React admin app (private repo)
- Contracts: `@kronos/contracts-public`
- Hosting: Firebase Hosting (UAT/Prod)

## Local Development

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

## Shared Contracts

This storefront only depends on the public-safe shared contracts package:

- `@kronos/contracts-public`

In the private monorepo source of truth, that package is provided locally. In the public storefront mirror, it should be exported alongside the app or published separately.

## Environment Variables

Create a `.env.dev`, `.env.uat`, or `.env.prod` based on the environment you want to run. For local development:

```
VITE_API_URL=http://localhost:8080/api/public
```

## Deployment

- UAT/Prod use Firebase Hosting
- The backend is hosted in Firebase App Hosting
- The CMS is hosted in Firebase Hosting

## Security Notes

- This repo is public for portfolio visibility
- Internal admin/backend contracts stay private
- Real credentials or secrets are never committed

## Additional Docs

- Contribution guide: `CONTRIBUTING.md`
- Security policy: `SECURITY.md`

## License

Private use only unless explicitly authorized.
