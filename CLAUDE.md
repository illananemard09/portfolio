# Working on this portfolio

- The owner wants to **see the site after every major change**. After each one:
  1. `npm run preview:build` (builds, then writes `preview/` with relative `assets/` paths).
  2. Republish `preview/index.html` to the existing artifact
     https://claude.ai/artifact/S6hZrRafovtiDPcdEofX8j (pass it as `url` from a new conversation),
     with `files` = every path in `preview/files.json` except those containing `/_`
     (mapped to `preview/<path>`).
  3. Send the owner the link and a one-line summary of what changed.
- The owner writes in French; reply in French.
- All copy lives in `content/site.ts`.
