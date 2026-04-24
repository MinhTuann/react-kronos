# Deployment Runbook (Storefront)

This runbook covers safe deployment for the public storefront while using the public-safe shared contracts package.

## Environments

- `dev`: local backend and local frontend
- `uat`: Firebase Hosting (storefront) + Firebase App Hosting (backend)
- `prod`: Firebase Hosting (storefront) + Firebase App Hosting (backend)

## Required Access

- Access to this repository
- Firebase project deploy permissions

## Build Inputs

- `.env.uat` for UAT build
- `.env.prod` for production build
- Access to the exported `@kronos/contracts-public` package when building outside the private monorepo

## Deploy Commands

UAT:

```bash
npm run deploy:uat
```

Production:

```bash
npm run deploy:prod
```

## Pre-Deploy Checklist

- Correct environment file values
- Public-safe contracts dependency resolves in install step
- `npm run build` passes
- No secrets present in git diff
- Backend public API endpoint is healthy

## Post-Deploy Checklist

- Storefront loads without console auth/dependency errors
- Product listing and detail pages can fetch data
- Filter/search flows work against expected API
- Error monitoring and logs show no critical regressions
