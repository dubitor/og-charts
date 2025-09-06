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
