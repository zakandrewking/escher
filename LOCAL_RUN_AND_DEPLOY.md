# Escher Deployment and Local Run Guide

## How to Run Locally

To test changes on your machine:

1.  **Open Terminal**: Open a terminal in the project directory.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Development Server**:
    ```bash
    npm start
    ```
4.  **Open Browser**: The application should automatically open at `http://localhost:7621`.

---

## Deploying to GitHub Pages

To publish your version of Escher to GitHub Pages (hosted at `https://<your-username>.github.io/<repo-name>/`):

### Prerequisites
*   You must have forked the repository to your own GitHub account.
*   You must be authenticated with GitHub on your local machine.

### Automatic Deployment
I have added a `deploy` script to `package.json`. You can run:

```bash
npm run build
npm run deploy
```

This will:
1.  Build the project into the `dist/` directory.
2.  Push the contents of `dist/` to the `gh-pages` branch of your repository.

### Manual Steps (if script fails)
1.  **Build**:
    ```bash
    npm run build
    ```
2.  **Install `gh-pages`** (one-time setup):
    ```bash
    npm install --save-dev gh-pages
    ```
3.  **Deploy**:
    ```bash
    npx gh-pages -d dist
    ```

### Option 2: Automatic Deployment via GitHub Actions (Recommended)

I have created a workflow file at `.github/workflows/deploy.yml`. This will automatically build and deploy your site whenever you push to the `main` branch.

**To enable this:**
1.  Push your changes to GitHub (including the new `.github/` folder).
2.  Go to your repository on GitHub.
3.  Go to **Settings** > **Pages**.
4.  Under **Build and deployment** > **Source**, perform one of the following:
    *   **If using the workflow I created**: Ensure "Deploy from a branch" is selected, but verify that the workflow runs successfully first. The workflow pushes to the `gh-pages` branch.
    *   once the Action runs (check the "Actions" tab), it will create/update the `gh-pages` branch.
    *   Then, in **Settings > Pages**, set the **Branch** to `gh-pages` and folder to `/ (root)`.

