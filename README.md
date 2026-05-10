# Twilight Princess Chronicle

This workspace builds the current Twilight Princess Chronicle guide site.

It builds:

- an English-first site at the project root
- a Chinese version under `zh/`

Both versions are generated from the project source archive and use the local supporting media stored under `assets/imported/twp/`.

## Build

Run:

```powershell
node scripts/generate-twilight-princess-site.mjs
```

Generate the site icons:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/generate-site-icons.ps1
```

## Output structure

- `index.html`
- `chapters/`
- `reference/`
- `intro/`
- `characters/`
- `epilogue/`
- `appendix/`
- `zh/`
- `assets/`

## Notes

- Root pages default to English.
- Each page includes a language switch to its Chinese or English counterpart.
- Before a public launch, update `site.config.json` with your real `siteUrl`, `contactEmail`, and any `adsTxtEntries`.
- Supporting images and local attachments referenced by the guide are copied into `assets/imported/twp/`.
