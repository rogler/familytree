# Family site (Nuxt 4 + Firebase Hosting)

## Setup
```bash
npm install
cp /path/to/your.ged data/family.ged     # private, gitignored
npm run dev                               # http://localhost:3000
```
Without `data/family.ged` the sample tree in `scripts/sample.ged` is used.

## Privacy
`scripts/build-tree.mjs` strips birth/death info for anyone treated as living
(no DEAT record and born < 110 years ago, or no birth date). Always open
`public/tree.json` and spot-check before deploying.

## Deploy
```bash
npm install -g firebase-tools
firebase login
# edit .firebaserc with your project id
npm run deploy
```
Then add your custom domain in Firebase Console > Hosting > Add custom domain.

## Notes
- `family-chart` is set to `latest`; after `npm install`, pin the installed version.
  If the CSS import in `components/FamilyTree.client.vue` fails, check the path under
  `node_modules/family-chart/dist`.
- Deploy from your own machine so `family.ged` never needs to be in git or CI.
