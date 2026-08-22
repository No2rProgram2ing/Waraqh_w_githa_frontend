# PRs checklist automation notes

This file is a lightweight checklist and template that I will use when creating the PRs. It helps reviewers by listing what to verify and how to run locally.

- PR Title: feat/ops: polish <area> (Dashboard|Payments|Orders|Customization)
- Branch: features/operations-admin
- Checklist for reviewer:
  - [ ] Does the page render without console errors?
  - [ ] Loading, Empty and Error states visible?
  - [ ] RTL alignment checked on mobile / desktop?
  - [ ] Form interactions (estimate/create/save draft) functional? (if backend not available, check network stub)
  - [ ] Accessibility: Focus order and aria labels for main controls
  - [ ] Performance: Large images lazy-loaded?

- Local run commands:
  - npm install
  - npm run dev
  - Visit: /admin/dashboard /admin/payments /admin/orders /admin/customizations/new

