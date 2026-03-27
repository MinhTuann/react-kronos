# Deployment Runbook (Storefront)

This runbook covers safe deployment for the public storefront while using private shared contracts.

## Environments

- `dev`: local backend and local frontend
- `uat`: Firebase Hosting (storefront) + Firebase App Hosting (backend)
- `prod`: Firebase Hosting (storefront) + Firebase App Hosting (backend)

## Required Access

- Access to this repository
- Read access to private `@kronos/contracts` source
- Firebase project deploy permissions

## Build Inputs

- `.env.uat` for UAT build
- `.env.prod` for production build
- Private dependency auth configured in build environment

## Private Dependency Authentication Options

1. Git over SSH (recommended)
- Use a read-only deploy key attached to `kronos-packages`
- Ensure build runtime can use the key when running `npm install`

2. GitHub Packages (private)
- Use a read-only token scoped to package read operations
- Configure token in deployment secret manager

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
- Private contracts dependency resolves in install step
- `npm run build` passes
- No secrets present in git diff
- Backend public API endpoint is healthy

## Post-Deploy Checklist

- Storefront loads without console auth/dependency errors
- Product listing and detail pages can fetch data
- Filter/search flows work against expected API
- Error monitoring and logs show no critical regressions
