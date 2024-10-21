# ui-monorepo

This repository contains the various apps and websites related to the Hemi Network along with reusable UI components.

## Major Components

[btc-wallet](./btc-wallet) The React components to integrate btc wallets (Currently, only Unisat is supported).

[claim-tokens](./claim-tokens/README.md) The microservice used to claim tokens in the portal's `get-started` page.

[migrations-pg](./migrations-pg/README.md) The migrations used for the database maintained for the claim tokens microservice.

[portal](./webapp) The portal app living in `https://app.hemi.xyz`.

## Deployment

Deploys to staging are triggered when merging changes to the `main` branch.

Deploys to production are triggered when a [release](https://github.com/hemilabs/ui-monorepo/releases/new) is created.
The suggested format for the tags is `YYYYMMDD_seq`.
The release notes could be auto-generated by GitHub after selecting the tag.

Tags applied with the following command will show in its message the list of all the PRs merged since the last tag:

```sh
git tag -s YYYYMMDD_seq -m "Deploy $(date -I)" -m "$(git log $(git describe --abbrev=0 --tags)..HEAD --oneline | grep Merge)"
```
