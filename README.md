# Opportunity Green Charts

Charts used in the Opportunity Green website.

Builds to a single html file for easy use in low-code website hosting tools.

## Setup

1. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
1. Enable yarn
    ```sh
    corepack enable
    ```
1. Install dependencies
    ```sh
    yarn install
    ```

## Run local server

```sh
yarn run dev
```

This serves the webpage on localhost.

Hot reload is enabled: any changes to a file will be immediately picked up by the server on save.

## Build to a single file

```sh
yarn run build
```

Creates a `dist/index.html` file with HTML, Javascript and CSS combined into a single file.

For easy upload to a website hoster tool.


## Adding dependencies

Squarespace has a max file size of 400KB for code blocks.

To keep build artefact size down, then, dependencies should be downloaded at runtime via a CDN `<script>` tag instead of included in the bundle (via `import` statements in JS files).

Still install third-party libraries as development dependencies to benefit from IDE tooling.

e.g. `yarn add <some-library> --dev`
