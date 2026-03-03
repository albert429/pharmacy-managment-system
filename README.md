# AngularJS Project

Template for an **AngularJS (1.x)** single-page application.

## Requirements

- A modern browser (Chrome/Edge/Firefox)

## Quick start

### Option A: Run with a simple static server (recommended)

From the project root:

```bash
npx http-server . -p 8080
```

Then open:

- http://localhost:8080

### Option B: Open directly (works for very simple apps)

You can open `index.html` directly in the browser, but some browsers block AJAX requests
(`$http`, templates, CORS) when running from the `file://` protocol. If anything fails,
use **Option A**.

## Project structure

Typical layout:

```text
.
├── index.html            # App shell
├── app.js                # AngularJS module + route/bootstrap
├── component/            # Reusable UI components/directives
├── controller/           # Controllers
└── service/              # Services/factories (API, state, utilities)
```

> Tip: Keep API calls in `service/` and keep controllers thin.

## Configuration

If your app needs environment-specific values (API base URL, feature flags), a common
AngularJS approach is:

- Create a `config.js` (not committed) that defines constants via `app.constant(...)`
- Create a `config.example.js` committed as a template

Example:

```js
// config.example.js
angular.module('app').constant('APP_CONFIG', {
  apiBaseUrl: 'http://localhost:3000',
});
```

Then include `config.js` in `index.html` _before_ files that use it.

## Common npm scripts (optional)

If you add a `package.json`, these scripts are common for AngularJS projects:

```json
{
  "scripts": {
    "start": "http-server . -p 8080",
    "lint": "eslint .",
    "test": "karma start"
  }
}
```

## Testing (optional)

Common AngularJS testing stack:

- Unit tests: **Jasmine** + **Karma**
- E2E tests: **Cypress** (or Protractor for legacy)

## Troubleshooting

- **Blank page or console errors**: open DevTools → Console and Network tabs.
- **CORS / API errors**: check the API base URL and whether the backend allows your origin.
- **Template not loading**: avoid `file://`; run a local server (see Quick start).

## Documentation

- Branding/palette tokens: `dev-docs/Branding.md`

## License

Add your license here (MIT, Apache-2.0, proprietary, etc.).
