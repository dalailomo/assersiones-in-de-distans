# i-see-assertions-in-the-distance

## Speech-to-Text (STT) Testing

This repository contains a basic Vue 3 application that demonstrates the integration of a speech-to-text (STT) workflow, complete with end-to-end (E2E) testing. The primary goal is to test the user journey of speaking through a microphone and receiving a transcription response, while accounting for inaccuracies in the STT system by leveraging Levenshtein distance for comparison.

## Features:
- Vue 3 Application: A lightweight and modular project structure for easy integration and testing.
- Speech-to-Text Workflow: Implements microphone input functionality and displays the transcribed text from an STT service.
- Levenshtein Distance Comparison: Ensures accurate testing by calculating the similarity between the expected and actual transcriptions, compensating for minor inaccuracies in the STT output.
- E2E Testing with Playwright/Cypress: Automates the user journey of speaking through the mic and validates the STT response using dynamic assertions.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

Copy file `src/config.ts.example` to `src/config.ts` and register to speechmatics for an api key. https://portal.speechmatics.com/api-keys. Don't worry, its free.

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/vue.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```
