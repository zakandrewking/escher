---
description: Build and deploy the application to GitHub Pages
---

This workflow deploys the current version of Escher (from the `main` branch) to GitHub Pages.

1.  **Install Dependencies**
    Ensure all packages are installed.
    ```bash
    npm install
    ```

2.  **Build the Project**
    Compile the application into static files in the `dist` directory.
    ```bash
    npm run build
    ```

3.  **Deploy**
    Use the `gh-pages` tool to push the `dist` folder to the `gh-pages` branch.
    ```bash
    // turbo
    npm run deploy
    ```
