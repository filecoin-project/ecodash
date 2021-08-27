# Filecoin Ecodash

Interactive ecosystem directory and showcase

**Just want to add a new project to the IPFS ecosystem directory? [Use this form](https://airtable.com/shrjwvk9pAeAk0Ci7).**

***

## Project Add/Change Workflow

The existing workflow for adding a project to the ecosystem directory, or amending an existing project, is as described below.

### Adding a New Project
- Project info is added to the [master IPFS project database](https://airtable.com/tblxBjPTzHXiUVZAA/viwpijXTIFraPRkhE?blocks=hide) in one of two ways:
     - Directly in the base as a new row
     - By requesting a project's representative fill in the [IPFS Ecosystem Directory Submission Form](https://airtable.com/shrjwvk9pAeAk0Ci7)
- Once a record is added to the database, an IPFS core team member reviews the record for accuracy, consistency, typos, etc, as well as determining whether the project should be included in the directory (a decision largely based on project maturity)
- If the project is approved to be included in the directory, directions for adding the data to the repo can be found [here](#transforming-project-data)

### Amending an Existing Project
- Project info should be amended in the [master IPFS project database](https://airtable.com/tblxBjPTzHXiUVZAA/viwpijXTIFraPRkhE?blocks=hide) as a single source of truth
- From there, un-tick and re-tick the `Include in directory?` box to regenerate the JSON
- Replace the JSON and/or images in the repo as indicated in the [instructions](#transforming-project-data)

***

## Generating the Showcase Grid

To view all projects in the ecosystem directory in a "logo parade" showcase format suitable for including in a slide deck, see the instructions below — this includes how to customize the grid to get the representation that's most useful for you.

TLDR: https://ecosystem.ipfs.io/showcase/?category=focus is a general-purpose, useful grid if you don't want to build a custom one.

## Behavior

- The showcase view is visible in its bare form at [ecosystem.ipfs.io/showcase](https://ecosystem.ipfs.io/showcase)
- It provides a logo-based visual summary of the projects in the app by category
- Each tag within the selected category is assigned a block
- The container for the tag is sized based on whether there's a small, medium, or large quantity of projects within it

## Customization

### Category

Customizing the view is done using GET parameters. You might notice that the base showcase link feels a little empty.

Adding a target top-level `category` param to showcase solves this issue. Examples:
- [/showcase/?category=industry](https://ecosystem.ipfs.io/showcase/?category=industry)
- [/showcase/?category=focus](https://ecosystem.ipfs.io/showcase/?category=focus)
- [/showcase/?category=benefits](https://ecosystem.ipfs.io/showcase/?category=benefits)

> Note: This category selection will work for _both_ categories that allow one tag per project (category in which tags are mutually exclusive) and categories that allow multiple tags.

### Containers

Instances of this app may have varying quantities of projects. To help the showcase address both large and small ecosystems, there are params that define container limits. These define what the limits are in terms of number of projects that fit into medium, or large containers.

- `md` minimum projects with a tag to display in a medium container (default is 10, if no value is provided)
- `lg` minimum projects with a tag to display in a large container ((default is 25, if no value is provided)

Example use case: [/showcase/?category=focus&md=5&lg=15](https://ecosystem.ipfs.io/showcase/?category=focus&md=5&lg=15)

> Note: The Showcase view is designed to support rows of 5 logos, so setting `lg` and `md` as multiples of 5 is recommended for the ideal visual appearance.

### Location

- The showcase path may be redefined in the app's `settings.json` under the key `showcaseBaseRoute`
  - Currently implemented as: `"showcaseBaseRoute": "/showcase"`
- The showcase has no links, and is not discoverable by search engines

***

## General Developer Information

### Deployment

This repo is currently deployed to Fleek on the following URLs:

`main` branch: https://ecosystem.ipfs.io/
`develop` branch: https://ipfs-ecosystem-develop.on.fleek.co/

Pushes made to the `main` or `develop` branches of this repo will automatically be reflected in the URLs above. Please allow 2-5 minutes for the application to re-build before seeing changes in your browser.


### Server

**Ports**

These apply to local development.

```
development: 20000
stable: 20001
production: 20002
```

**Mode**: `static`

**Environment Variables**

```
NODE_ENV → development|production
SERVER_ENV → development|stable|production
```

***

## Getting Started

### A. Get Repo

In a terminal, run the commands below to get set up

```bash
# Navigate to directory within which to clone the git repo. A new directory is created within this one called ecosystem-directory
$ cd ~/Desktop

# Clone the repo
$ git clone git@github.com:ipfs/ecosystem-directory.git

# Enter the repo directory
$ cd ecosystem-directory

# Add your user information
$ git config user.name "Your Name"
$ git config user.email "your.email@ipfs.io"

# Install npm dependencies
$ npm ci
```

### B. Generating a self-signed SSL certificate

Used for development in a local environment (such as on your personal computer). You only need to do this once. If you've already done this for a different project, just copy your existing `localhost_cert.pem` and `localhost_key.pem` files from `~/.ssh` into the root directory of this repo and skip the rest of this step.

1. [Install mkcert and generate certificate](https://github.com/FiloSottile/mkcert) by running the commands below, in that order:

  ```bash
  $ cd ~/.ssh
  $ brew install mkcert
  $ mkcert -install
  $ mkcert -key-file localhost_key.pem -cert-file localhost_cert.pem localhost 127.0.0.1
  $ cat localhost_cert.pem > localhost_fullchain.pem
  $ cat "$(mkcert -CAROOT)/rootCA.pem" >> localhost_fullchain.pem
  ```

2. Copy the new `localhost_cert.pem` and `localhost_key.pem` files to the root directory of this repo
3. Start the server and navigate to `https://localhost:<your_port>`

### C. Environment variables

Create a file called `.env` and put it into the root directory of this repo. Add the following environment variables:

```
NODE_ENV=development
SERVER_ENV=development
```

### D. Start the app

```bash
$ npm run dev
```

***

## Project Model

Below is an outline of the project model. An empty JSON file can be found in `@/content/projects/template.json`. This template file can be duplicated, filled out and renamed to create a new project. It is not necessary to generate a project ID since the filename of each project will serve as a project `slug`.

### Naming Convention

This means that file names must be named after project names, and use lowercase and kebab-case. For example, an appropriate project `slug` would be `world-wide-web`, and therefore the corresponding file would be `world-wide-web.json`. It's important to not deviate between the file name and the `name` of the project.

### Keys

Keys should be retained when not in  use. This ensures that if anyone wants to add to the project, they immediately see all keys available in other projects, rather than searching for the model or accidentally using a data structure that doesn't match the model perfectly. This means empty and type checking is done by the app in a strict fashion.

- `display`: toggle whether or not to display or hide the project from the results

- `featured`: toggle whether this appears in the featured slider

- `sortNumbers`: these labels and numbers will be used in the sort-by filter

- `logo`: all logos will be in SVG format and must be placed in the `static` directory

- `name`: name of the product

- `org`: a product can belong to multiple organizations

- `description`: 2 descriptions are needed. A long description that will be visible on the Project Single page and a short description that is visible in the card format (such as the Featured slider). If none provided, a truncated version of the long description will be used.

- `primaryLink`: this is the 1st link found directly under the project description

- `links`: these links will always appear at the top of the **Key Info** section, however, these links could be extended to use elsewhere in the future

- `keyInfo`: these key/value pairs will always appear below the links in the **Key Info** section

- `video`: can be a URL to either a YouTube or Vimeo video, the video must be publicly accessible and embeddable

- `stats`:  general statistics with short descriptions, also known as "big numbers"

- `ctaCard`: this card will always be displayed as the last block in the stats section. The button text can be changed in `@/content/pages/project.json`

- `taxonomies`: the taxonomies contain a `slug` that will match a master taxonomy object (found in: `@/content/pages/general.json`); if none match, this taxonomy and its tags will not be displayed

### Schema

The schema can be found in `@/content/data/project-schema.js` and _must_ be updated if the schema ever changes. The `$setProjectDefaults()` global method (found in `@/plugins/global-methods.js`) uses `project-schema.js` in order to perform type checking.

```ts
{
  display: Boolean,
  featured: Boolean,
  sortNumbers: {
    label: Number
  },
  logo: {
    icon: String,
    full: String
  },
  name: String,
  org: [String],
  description: {
    short: String,
    long: String
  },
  primaryCta: {
    url: String,
    text: String
  },
  links: [{
    label: String,
    links: [{
      url: String,
      text: String
    }]
  }],
  keyInfo: [{
    label: String,
    value: String
  }],
  video: String,
  stats: [{
    label: String,
    value: String
  }],
  ctaCard: {
    title: String,
    description: String,
    buttonText: String,
    url: String
  },
  taxonomies: [{
    slug: String,
    tags: [String]
  }]
}
```

***

## Transforming Project Data

Each project that is to be included in the ecosystem must have a `json` file in `content/projects`, with the project name in `kebab-case`. For instance, `content/projects/foo-bar.json`.

#### Transferring a Project

The primary source of truth for the Ecosystem Directory is the [master IPFS project database](https://airtable.com/tblxBjPTzHXiUVZAA/viwpijXTIFraPRkhE?blocks=hide), which has a field `Include in directory?` that indicates whether a project is ready for inclusion. A script has been added there, which converts that ecosystem entry to `json`, per the project model described. This script runs each time a project is checked for inclusion in the Ecosystem Directory.

#### Inputting a Project

Alternatively, any of the existing projects in `content/projects` can be copied, and the new `json` file can be altered to create a new project.

### Process

When either transferring or inputting a project from a copied `json`, the following process should be observed:

- Copy the generated JSON output
- Create a new file in `content/projects/.`. with the project name in `kebab-case` as the file name, (with a `.json` extension)
- Make sure the project's contents look correct, and ideally ensure that `json` formatting is preserved, including an empty line at the end of the file
  - Using a code editor's prettify function for `json` can correct this
- Download the images (icon and full logo) from the CRM or from the project organization, and place them in `static/images/projects/.`
- Ensure any of the `stat`s (also known as "big numbers") have the correct values, as the CRM script is not good at recognizing where to split the big number
- Pull request the new projec(s) into the repository and use the build preview to see how it looks—or check locally

_This process could be further automated with a variety of tooling at a later date._

***

## Analytics

The following environment variables are required:

```bash
NODE_ENV=<production|development>
COUNTLY_APP_KEY=<key>
COUNTLY_SITE_URL=<url>
```

The following `nuxt.config.js` entries are required:

```js
{
  countly: {
    debug: Boolean,
    disableInDevelopment: Boolean,
    suppressErrorLogs: Boolean
  }
}
```

Below is a breakdown of all events captured by Countly.

### → General

```js
Countly.track_sessions()
Countly.track_pageview()
Countly.track_links()
```

### → Segment Chart

**Segment clicked**

`name: <category_label>`

`slug: <category_slug>`

```js
Countly.trackEvent('Segment Chart | Segment Clicked', { label, slug })
```

**View All button clicked**

`name: <category_label>`

`slug: <category_slug>`

```js
Countly.trackEvent('Segment Chart | View All Button Clicked', { label, slug })
```

### → Featured Slider

**Project card clicked**

`name: <project_name>`

`slug: <project_slug>`

`from: Home Page | Detail Page`

```js
Countly.trackEvent('Featured Slider | Project Card Clicked', { name, slug, from })
```

### → Events

**Filter Panel Toggled**

`button: filters | x-icon | done`

`state: open | closed`

```js
Countly.trackEvent('Filter Panel Toggled', { button, state })
```

**Sort-By Dropdown Toggled**

`state: open | closed`

```js
Countly.trackEvent('Sort-By Dropdown Toggled', { state })
```

**Sort-By Option Selected**

`label: <sort_option_label>`

`slug: <sort_option_slug>`

```js
Countly.trackEvent('Sort-By Option Selected', { label, slug })
```

**Pagination Button Clicked**

`page: <number>`

```js
Countly.trackEvent('Pagination Button Clicked', { page })
```

**Results-Per-Page Dropdown Toggled**

`state: open | closed`

```js
Countly.trackEvent('Results-Per-Page Dropdown Toggled', { state })
```

**Results-Per-Page Option Selected**

`option: <number>`

```js
Countly.trackEvent('Results-Per-Page Option Selected', { option })
```

**Grid-List View Toggled**

`view: list | grid`

```js
Countly.trackEvent('Grid-List View Toggled', { view })
```

**Filter Chiclet Clicked**

`tag: all | <tag>`

`category: <parent_category>`

`state: on | off`

```js
Countly.trackEvent('Filter Chiclet Clicked', { tag, category, state })
```

**Clear Filters Button Clicked**
`count: <number>`

```js
Countly.trackEvent('Clear Filters Button Clicked', { count })
```

**Filter Panel Search Input**

There exists a 500ms debounce function in the search input so as to provide a greater chance of capturing a full rather than partial search query.

`query: <search_term>`

```js
Countly.trackEvent('Filter Panel Search Input', { query })
```

### → Header/Footer

Links get automatically tracked by `Countly.track_links()`

### → 404

```js
Countly.trackEvent('404_NOT_FOUND', {
  path: this.$route.path,
  referrer: document.referrer
})
```

### → Query params

Track URL entire query param object when interacting with project filtering system. Since every param change is already tracked individually as per the list above, this tracker exists as an added layer for testing.

`query: Object`

```js
Countly.trackEvent('Query Param Debug', { query })
```
