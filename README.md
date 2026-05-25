# VPNHUB Tutorial Blog - Netlify Fixed Build

This version fixes the Netlify deploy error by using a non-hidden Eleventy config file:

```text
eleventy.config.cjs
```

The build command is:

```bash
npm run build
```

`package.json` runs:

```bash
eleventy --config=eleventy.config.cjs
```

## Netlify settings

Build command:

```text
npm run build
```

Publish directory:

```text
_site
```

## Admin panel

After deployment and after enabling Netlify Identity + Git Gateway, open:

```text
/admin/
```

You can add, edit, and delete blog posts from the browser admin panel.

## Important

Upload the full project folder to GitHub, including this file:

```text
eleventy.config.cjs
```

Do not upload only the `src` folder.
