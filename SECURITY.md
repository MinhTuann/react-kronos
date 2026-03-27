# Security Policy

This project is part of a real client deployment. Security and data protection are required standards.

## Supported Deployment Model

- Public repo: `react-kronos` (storefront UI)
- Private repos: backend, CMS, shared contracts
- Firebase projects: `dev`, `uat`, `prod`

## Reporting a Security Issue

Please do not open public issues for vulnerabilities.

Report privately to the maintainer with:

- Summary of issue
- Reproduction steps
- Affected environment (`dev`, `uat`, or `prod`)
- Impact assessment

## Security Boundaries

- `@kronos/contracts` remains private
- Admin APIs are private and protected
- Public storefront consumes only public API routes

## Secrets and Credentials

- Never commit secrets into this repository
- Use environment variables for all endpoints and sensitive settings
- Keep production credentials in deployment platform secret stores only

## Dependency and Supply Chain Guidance

- Prefer pinned versions for internal/private packages
- Use read-only tokens or read-only deploy keys for CI access
- Rotate credentials on compromise or role changes

## Operational Recommendations

- Enforce least privilege for repository and deployment access
- Enable branch protection on `main`
- Require pull requests and reviews for production-impacting changes
- Keep Firebase rules and backend auth checks aligned across environments
