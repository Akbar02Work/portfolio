# Release Checklist

Use this checklist before production deployment.

## 1. Automated Gates

- [ ] `npm run lint`
- [ ] `npm run lint:cycles`
- [ ] `npm run test`
- [ ] `npm run test:e2e`
- [ ] `npm run build`
- [ ] `npm run check:bundle`
- [ ] `npm run ci:full`

## 2. Performance Gates

- [ ] Initial JavaScript and CSS payload is under the 150 KB gzip budget.
- [ ] No unexpected increase in `dist/assets/*.js`.
- [ ] Lighthouse Performance score is greater than 90 on mobile profile.
- [ ] Scroll and animation interactions remain smooth on low-end devices.

## 3. Accessibility Gates

- [ ] Lighthouse Accessibility score is greater than 95.
- [ ] Keyboard navigation works for menu, carousel, and all links/buttons.
- [ ] Focus-visible state is visible on all interactive controls.
- [ ] Screen reader announces current carousel slide.
- [ ] Color contrast satisfies WCAG AA for key text and controls.

## 4. Functional Smoke Checks

- [ ] Home page loads with no console errors.
- [ ] Project card opens project detail route.
- [ ] Invalid project slug shows 404 state.
- [ ] Theme choice persists after reload.
- [ ] Scroll restore works after reload.
- [ ] Easter page renders correctly and does not regress main navigation.

## 5. Deployment Checks

- [ ] Preview deployment created and reviewed.
- [ ] Security headers present in response.
- [ ] Production monitoring (Sentry) initialized in production environment.
- [ ] Release notes/changelog updated.
