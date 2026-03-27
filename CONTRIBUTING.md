# Contributing to Kronos Storefront

Thanks for your interest in contributing.

This repository is public for portfolio transparency, but it is part of a production system with private services and private shared contracts.

## Prerequisites

- Node.js 20+
- npm 10+
- Access to private `@kronos/contracts` dependency

Without access to private contracts, `npm install` will fail by design.

## Local Setup

1. Verify SSH access to GitHub:

```bash
ssh -T git@github.com
```

2. Install dependencies:

```bash
npm install
```

3. Start local dev:

```bash
npm run dev
```

If `npm install` fails with `Permission denied (publickey)` or `checkout null`, verify:

```bash
ssh -T git@github.com
git ls-remote git@github.com:MinhTuann/kronos-packages.git
```

## Environment Files

- `.env.dev` for local development
- `.env.uat` for UAT build/deploy
- `.env.prod` for production build/deploy
- `.env.example` is the public template and contains no secrets

## Security Rules for Contributors

- Do not commit credentials, API keys, or private hostnames.
- Do not expose private contracts in this public repository.
- Do not hardcode any environment URLs in source files.

## Pull Request Guidance

- Keep changes small and focused.
- Include test/build proof for behavior changes.
- Mention any deployment or environment variable impact in PR description.
