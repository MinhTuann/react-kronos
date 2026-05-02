# Contributing to Kronos Storefront

Thanks for your interest in contributing.

This repository is public for portfolio transparency, but it is part of a production system with private services and a public-safe shared contracts package.

## Prerequisites

- Node.js 20+
- npm 10+
- Access to the exported `@kronos/contracts-public` package when working outside the private monorepo

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start local dev:

```bash
npm run dev
```

## Environment Files

- `.env.dev` for local development
- `.env.uat` for UAT build/deploy
- `.env.prod` for production build/deploy
- `.env.example` is the public template and contains no secrets

## Security Rules for Contributors

- Do not commit credentials, API keys, or private hostnames.
- Do not expose internal admin/backend contracts in this public repository.
- Do not hardcode any environment URLs in source files.

## Pull Request Guidance

- Keep changes small and focused.
- Include test/build proof for behavior changes.
- Mention any deployment or environment variable impact in PR description.
