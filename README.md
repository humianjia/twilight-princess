# Twilight Princess Chronicle

This workspace now keeps only the mirror-based Twilight Princess site.

It builds:

- an English-first site at the project root
- a Chinese version under `zh/`

Both versions are generated from the local mirror in `sources/twp`, and both use the copied local images in `assets/imported/twp/`.

## Build

Run:

```powershell
node scripts/generate-twilight-princess-site.mjs
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
- Source images and local attachments referenced by the mirrored pages are copied into `assets/imported/twp/`.
