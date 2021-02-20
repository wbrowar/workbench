# REPLACE_PROJECT_TITLE
Website at [REPLACE_WEBSITE_DOMAIN](https://REPLACE_WEBSITE_DOMAIN)

## Environments
GitHub branches and hosting environments.

| Environment | Branch | URL | Deployment | Notes |
|---|---|---|---|---|
| Production | `main` | https://REPLACE_WEBSITE_DOMAIN | [GitHub Actions](REPLACE_PATH_TO_REPO/actions?query=branch%3Amain) | <ul><li>Live website.</li><li>Manages the master database.</li><li>Has tracking scripts enabled.</li><li>DevMode is disabled.</li></ul> |
| Staging | `staging` | https://staging.REPLACE_WEBSITE_DOMAIN | [GitHub Actions](REPLACE_PATH_TO_REPO/actions?query=branch%3Astaging) | <ul><li>Used for previewing code changes before being pushed live.</li><li>Data can be replaced at any time.</li><li>Tracking scripts are disabled.</li><li>DevMode is disabled.</li></ul> |
| Development | `dev` | https://dev.REPLACE_WEBSITE_DOMAIN | [GitHub Actions](REPLACE_PATH_TO_REPO/actions?query=branch%3Adev) | <ul><li>Used for testing code changes currently in development.</li><li>Data can be replaced at any time.</li><li>Tracking scripts are disabled.</li><li>DevMode is enabled.</li></ul> |

## Setup
Instructions for setting this project up for local development.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. Install [ddev](https://ddev.readthedocs.io/en/stable/).
1. Clone this repo to your local machine.
1. Copy the `example.env` file and name it `.env`. Update any values that are specific to your machine. _NOTE: most of the DDEV values are already set. The `ENVIRONMENT` variable should be set to `dev` unless you need to test functionality in a different environment._
1. Run `ddev start` to setup your local DDEV files and test that the site can be run locally.
1. Pull down a copy of the production database to your local machine.
1. Use `ddev import-db --src=REPLACE_PATH_TO_FILE` to import the database into DDEV.
1. Visit the local domain (usually set to `.test`) to confirm that the import was successful and that the site can be run locally.

## Process
Instructions for making changes and deploying them to the server.

### Code Changes

1. Checkout the `dev` git branch on your local machine.
1. Run `ddev start`.
1. Make code changes.
1. Commit changes and push commit to `dev`. GitHub Actions will use the commit to deploy the site to the dev environment.
1. After deployment is a success, the code on `dev` can be promoted to `staging` and then `main` to publish changes to production.

### Upgrading Craft and Craft plugins

1. Checkout the `dev` git branch on your local machine.
1. Run `ddev start`.
1. Pull down a copy of the production database to your local machine.
1. Use `ddev import-db --src=REPLACE_PATH_TO_FILE` to import the database into DDEV.
1. Log into the local version of the CMS as an Admin user.
1. Go to `Utilities > Updates` and update the CMS and plugins.
1. Commit changes and push commit to `dev`. GitHub Actions will use the commit to deploy the site to the dev environment.
1. After deployment is a success, the code on `dev` can be promoted to `staging` and then `main` to publish changes to production.

### Troubleshooting

If you run into issues with DDEV, the build process, PHP, or Craft, follow these steps to clean out local files and re-install portions of the application.

- To re-install Craft and all the composer dependencies, remove `vendor` and `composer.json` and run `ddev restart`.
- To wipe out the DDEV installation and start over, run `ddev stop --remove-data` and then follow the steps in [Setup](#setup) to start over.

## Services
Hosting and deployment services used by this project.

### DDEV
Sets up the local Docker container and provides helper functions that make port routing and databse importing easier. DDEV also allows for SSH commands to be run within the container (using `ddev exec REPLACE_COMMAND`)

#### Cost
DDEV is free and open source.

---

### Docker
Provides services—like NGINX, PHP, and MariaDB—in a containerized directory in your local file system. Working within Docker means all developers are using the same versions of each of these services, providing consitency and a development environment that is close to that of the production hosting environment.

#### Cost
Docker is free for local development.

---

### GitHub
GitHub stores the git repos for all branches of this project. This project is stored in a private repo in a GitHub Organization.

#### Access
To access GitHub, a GitHub account needs to be added to the GitHub Organization as a Member.

#### Cost
This project uses the free GitHub Organization plan. Exceeding any of GitHub’s free limits will result in a charge for the overage needed within the given payment period. Usage and billing info can be found in GitHub in **Organization > Settings > Billing & plans**.

---

### GitHub Actions
GitHub Actions deploys code when it is pushed to the `dev`, `staging`, and `main` branches to their respective hosting environments. During the deployment process, SSH commands are run on the server to finish up database migrations and to apply changes to the project configuration. During deployment all caches are flushed to ensure that all content and template changes are reflected on the site. 

#### Cost
GitHub Actions bills based on minutes used per month. Visit the **Organization > Settings > Billing & plans** page to see current usage.

---

### Laravel Forge
Forge provisions NGINX, PHP, and MariaDB services on Linode servers. Forge is also used to manage the webroot, SSH keys, and SSL certificates for each hosted website. 

#### Access
SSH keys can be added to each server in Forge to provide access for SSH and SFTP.

#### Cost
For is billed annually at $120/yr.

---

### Linode
The server hardware that hosts the website is provided by Linode. Each instance of the server is a VPS and each one is set up with automatic server backups. Each server instance is provisioned using Laravel Forge. 

#### Access
To log into Linode, use the account username and password. **NOTE: a root SSH user is technically available, but it should not be used. See information on Laravel Forge above to gain SSH or SFTP access to the server.**

#### Cost
Billing for Linode servers is based on hourly usage. For example, a server with 1G of RAM is billed at $10/mo. but if the server is upgraded or downgraded throughout the month, the bill is adjusted for the hours used by each server level.

---

### Linode Object Storage
Files that are uploaded via the CMS are stored in Linode’s S3-compatible object storage buckets.

#### Access
Access tokens for object storage can be set up within Linode.

#### Cost
Object storage is a subscription that costs $5/mo. until usage thresholds are hit. For more information on storage limits, visit: https://www.linode.com/docs/guides/pricing-and-limitations/
