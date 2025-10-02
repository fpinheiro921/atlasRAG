### 9. Project Rules & Coding Standards

1. **Commit Hygiene:** Conventional Commits.
2. **Branching Model:** Trunk-Based Development.
3. **Lint / Format:** ESLint, Prettier, lint-staged.
4. **Review Checklist:** PRs require one approval. Reviewer must explicitly check for changes to `firestore.rules` and their security implications.
5. **CI Gates:** CI must run tests against the Firebase Emulator Suite. A separate step should validate the `firestore.rules` syntax.
6. **Environment Management:** Use `.firebaserc` to manage aliases for `dev` and `prod` Firebase projects. Never hardcode project IDs.
 ```json
 // .firebaserc
 {
 "projects": {
 "default": "atlas-dev",
 "prod": "atlas-prod"
 }
 }
 ```