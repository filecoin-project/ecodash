# Administration documentation

This area of the documentation is intended for administrators of the project, including anyone who needs to run a local instance of the site.

### Deployment

This repo is currently deployed to Fleek on the following URLs:

- `main` branch: https://ecosystem.filecoin.io (production)
- `develop` branch: https://fil-ecosystem-explorer.on.fleek.co (staging)

Pushes made to the `main` or `develop` branches of this repo will automatically be reflected in the URLs above. Allow 2-5 minutes for the application to rebuild before seeing changes in your browser.

### Commit messages

It's recommended to use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) in this project. However, to avoid confusion from users, they **aren't strictly being enforced** with pre-commit hooks. Still, it's advisable to use these prefixes for titling a commit:

- `feat:` A feature, or part of a feature
- `fix:` A bug fix
- `style:` A visual or stylistic change only
- `chore:` An operational task, such as routine maintenance, version control related operations, dependencies, etc.
- `refactor:` A change to the way the code is implemented, without materially changing the feature
- `perf:` A change that is made primarily to improve performance
- `test:` Any changes required to run a specific test or try out a behavior for the purposes of testing
- `cleanup:` Markup and syntactic cleanup that doesn't affect the code output
- `docs:` Documentation-related changes
- `content:` Changes to the project's content, such as copy or media

### Naming Convention

File names containing project content must be named after project names, and use lowercase and kebab-case. We call these `slug`s. 
For example, for a project called _World Wide Web_, an appropriate project `slug` would be `world-wide-web`, and therefore the corresponding file would be `world-wide-web.json`. It's important to not deviate between the file name and the `name` of the project.

## Evaluating community-submitted content

The repo as a whole should require minimal maintenance and should remain stable over time without updates to the core codebase.

The one task that will require ongoing attention is reviewing and merging PRs submitted by the community. The following is a suggested process, or checklist to follow when reviewing additions or modifications to projects.

1. Check the PR's source: does the submitter appear to be valid? (i.e., verify that it's _their_ project to edit)

2. Check to make sure the PR uses `main` as the base branch (this is the default and should always be the case)

3. Ensure all checks have passed: the PR should have no failed checks

4. Open the build preview from the checks section of the PR, ensure their project looks correct and that all the links are valid

5. Check the `Files changed` tab and ensure the user has _only_ changed appropriate project `json` files within `content/projects/` — no other files should have been modified

6. Submit a review with any comments

7. Merge the PR into `main`

Within a few minutes, the updated site will be visible on production.


## Stack

The project is built and deployed as a static site and an SPA (single-page app). Despite being static, it invokes some application-like behavior.

- Uses a Vue framework, [nuxtJS 2](https://nuxtjs.org/), deployed in static mode
- The site itself is served statically, but internal navigation is virtualized in the browser: in other words, the site acts as an SPA when browsed on the client
- Requires nodeJS and has been tested on node 16
- Styles are written in SCSS, and are concatenated and tree-shaken during compile-time
- The static site is deployed via Fleek, and is therefore available on IPFS using CID-based paths, or through many IPFS gateways
- Content is abstracted into `json` files, and should be managed by editing these files and creating pull requests


## Local development

Running this project locally requires a few steps and dependencies.

### 1. Cloning the repo

First clone the repo to your local disk, and install all dependencies. The following are a sequence of

```zsh
# Navigate to your desired local path
cd ~/Projects/

# Clone the repo
git clone git@github.com:filecoin-project/ecosystem-directory.git

# Enter the repo directory
cd ecosystem-directory

# Add your user information
git config user.name "Your Name"
git config user.email "your.email@protocol.ai"

# Install npm dependencies
npm ci
```

### 2. Generate a self-signed certificate

In order to browse with TLS locally, you'll need a certificate. A self-signed certificate is satisfactory for this purpose. Here's how to set one up.

Generating a self-signed SSL certificate

Used for development in a local environment (such as on your personal computer). You only need to do this once. If you've already done this for a different project, just copy your existing `localhost_cert.pem` and `localhost_key.pem` files from `~/.ssh` into the root directory of this repo and skip the rest of this step.

- [Install mkcert and generate certificate](https://github.com/FiloSottile/mkcert) by running the commands below, in this order:
  ```zsh
  cd ~/.ssh
  brew install mkcert
  mkcert -install
  mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
  cat localhost_cert.pem > localhost_fullchain.pem
  cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
  ```
- Copy the new `localhost_cert.pem` and `localhost_key.pem` files to the root directory of this repo

The above tutorial is specifically for MacOS machines with `brew` installed. For other *nix OS's replace the installation step with your preferred package manager (e.g. `apt install mkcert`).

### 3. Environment Variables

In the repo root directory, create a `.env` file and populate it with this content:

```ini
NODE_ENV=development
SERVER_ENV=development
```

This is suitable for local development. For deployements of the production site, both values should be `production` instead.

### 4. Start the app

You're all set. simply start the app by running 

```
npm run dev
```

- If you ever need to rebuild dependencies, just run `npm ci`
- The full build command for CIs is `npm ci && npm run generate`, but that isn't needed for local development

## Miscellaneous

### Updating dependencies

Please use `npm ci` in place of `npm i` when not explicitly upgrading depdendencies. `npm ci` will only install versions of packages provided in the lockfile, leading to more stability. 

Always regression test the site if upgrading packages, as they may contain breaking changes.

### Syntactic and stylistic guide

1. File names should be in `kebab-case`
2. Component names, which are imported, should be `PascalCase`
3. The grid used is a flexbox style system called [Gridlex](https://gridlex.devlint.fr/), its documentation is also available as a [readme in this repo](assets/scss/grid/README.md)
4. Color name variables in `SCSS` are obtained from [this resource](https://chir.ag/projects/name-that-color/)


### Other

**Ports**

The following ports are used, depending on the environment.

```
development: 20000
stable: 20001
production: 20002
```

**Mode**: `static`

**Environment Variables**

```ini
NODE_ENV → development|production
SERVER_ENV → development|stable|production
```
