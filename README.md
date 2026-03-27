# Kronos Watch Store - Storefront (React)

This is the public storefront for the Kronos Watch Store system. The full system is split into three services:

- Storefront (this repo, public)
- CMS admin (private)
- Backend API (private)

The shared API contracts live in a private package repo and are intentionally not public.

## Architecture Overview

- Frontend: React + Vite
- API: Node/Express backend (private repo)
- CMS: React admin app (private repo)
- Contracts: `@kronos/contracts` (private repo)
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

## Private Contracts Requirement

This project depends on a private package: `@kronos/contracts`.

The dependency is installed from a private GitHub repo. You must have access to that repo in order to install dependencies and build the project.

If you do not have access, the install will fail with an authentication error. This is expected and intentional to protect internal interfaces.

If you are the project owner and need access on a new machine or CI environment, configure one of the following:

- GitHub Packages with a read-only token (`read:packages`)
- Git over SSH with a read-only deploy key

Recommended for this project:

- Local machine: Git over SSH
- CI/deployment: read-only deploy key or read-only token

Quick check for SSH access:

```bash
ssh -T git@github.com
git ls-remote git@github.com:MinhTuann/kronos-packages.git
```

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
- Internal contracts and private services stay in private repos
- Real credentials or secrets are never committed

## Additional Docs

- Contribution guide: `CONTRIBUTING.md`
- Security policy: `SECURITY.md`

## Troubleshooting Private Contracts

If `npm install` fails for `@kronos/contracts`:

1. `Permission denied (publickey)`
- Your current shell does not have a usable SSH key for GitHub.
- Fix:
  - `eval "$(ssh-agent -s)"`
  - `ssh-add ~/.ssh/id_ed25519`
  - `ssh -T git@github.com`
  - `git ls-remote git@github.com:MinhTuann/kronos-packages.git`

2. `The git reference could not be found` with `checkout null`
- This often means npm could not resolve the remote git ref because repository access failed.
- Validate SSH/repo access first with the two commands above.

## License

Private use only unless explicitly authorized.
