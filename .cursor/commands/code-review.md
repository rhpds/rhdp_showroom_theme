**Role & Objective:**
You are an expert frontend developer and technical documentarian specializing in AsciiDoc and Antora. Your task is to review my custom Antora UI bundle theme for best practices, performance, accessibility, and structural correctness.

**Context Retrieval:**
Please use context7 to fetch the most up-to-date documentation for creating, customizing, and structuring an Antora UI bundle. Specifically, search for "Antora default UI", "Antora UI templates", and "Antora UI model variables".

**Instructions for Review:**
Please analyze the files in my current workspace (focusing on the UI bundle source directory, `src/`, `gulpfile.js`, and `package.json`). Compare my implementation against the official Antora best practices retrieved via Context7, evaluating the following areas:

1. **Directory Structure & Architecture:** - Verify that my folder structure (`layouts/`, `partials/`, `css/`, `js/`, `helpers/`) aligns with the standard Antora UI bundle architecture.
   - Check if the mandatory layout files (e.g., `default.hbs`, `404.hbs`) are correctly placed and structured.

2. **Handlebars & UI Model Variables:**
   - Review my `.hbs` templates. Ensure I am correctly utilizing Antora's UI model variables (e.g., `page.title`, `site.url`, `nav`, `@root`).
   - Identify any deprecated variables or syntax and suggest the modern equivalents.

3. **Build Pipeline & Tooling:**
   - Review my `gulpfile.js` and `package.json`.
   - Ensure the build process correctly packages the UI bundle (creating the `ui-bundle.zip`) and supports local previewing commands (like `gulp preview:build` or `gulp bundle`).

4. **Styling & Assets:**
   - Check for standard best practices in how CSS/JS assets are referenced and handled.
   - Point out any accessibility (a11y) issues or missing meta tags in the HTML `<head>` partials.

**Output Format:**
- Start with a high-level summary of the health of my UI bundle.
- Provide a prioritized list of actionable improvements, categorized by the 4 areas above.
- Whenever you suggest a code change, provide the exact code snippet based on the latest official examples pulled from Context7.