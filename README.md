
To deploy client/server code:

gcloud app deploy

To deploy firebase cloud functions:

firebase deploy


npm run serve to run server
npm run serve to run client

npm run build to build

node admin.js to run admin functions

## Local validation

Use Node 22.13.1 and the repository's Yarn 4.9.1 release for validation. `.env.yarn` disables Node's synchronous `require(ESM)` loader for Yarn subprocesses so Plug'n'Play resolves ESM dependencies. The Vitest configurations use `.mts` to load Vite as ESM while the server and Firebase packages remain CommonJS.

With Node and Yarn on `PATH`, run the committed-tree gate after committing changes:

```sh
git test run HEAD --retest --verbose --verbose
git test results HEAD
```

## Sharing Avalon game rules

Investigation completed on 2026-10-05: use `server/common/avalonlib.mjs` as the maintained source and generate the two CommonJS files before builds, tests, and Firebase deployment. This is a recommendation; the runtime files and build commands still use the existing manual copies.

### Current consumers and deployment boundary

| File | Consumers | Module format |
| --- | --- | --- |
| `server/common/avalonlib.mjs` | `client/src/avalon.js`, `client/src/components/Lobby.tsx`, `client/src/components/Lobby.vue` | ES module, default import |
| `server/common/avalonlib.js` | `server/avalon-server.js` | CommonJS, `require` |
| `firebase/functions/common/avalonlib.js` | `firebase/functions/common/stats.js`, also reached through `server/admin.js` | CommonJS, `require` |

All three currently contain the same eight roles, including ASSASSIN, and the same player-count rules. They have no runtime imports. Node assertions confirmed deep equality of the role arrays and equal `getNumEvilForGameSize` results for inputs 0 through 12, including unsupported sizes returning `undefined`.

`firebase/firebase.json` selects `functions` as its source directory and currently runs only lint in `predeploy`. The declared Firebase CLI version, 13.29.1, archives files beneath that source and excludes `node_modules` by default. A relative import reaching into `server/` therefore cannot work in an independently uploaded functions directory. See the [Firebase CLI packaging implementation](https://github.com/firebase/firebase-tools/blob/v13.29.1/src/deploy/functions/prepareFunctionsUpload.ts).

### Options

| Approach | Benefits | Costs and constraints |
| --- | --- | --- |
| Symlink the CommonJS copies | One physical CommonJS source in a full checkout | Does not supply browser ESM. An external symlink needs its target during packaging and a verified archive that contains usable code; copying only `firebase/functions` loses that target. Avoid relying on archive symlink handling. |
| Generate deployment files from one ESM source | Preserves existing imports and Firebase's self-contained source directory; no published package | Two generated artifacts remain on disk. Generation must run on every relevant entry point, and validation must reject stale output. Recommended for this small library. |
| Add a shared Yarn workspace package | Explicit shared dependency and a place for future game modules | Workspace linking alone does not include code outside the functions upload root. Deployment also needs bundling, a tarball inside the upload directory, or a published package. CommonJS browser consumption needs Vite configuration, or a generated ESM entry. |

The repository already has three Yarn workspaces. A fourth package would organize ownership but would not remove Firebase's packaging requirement. [Yarn's workspace documentation](https://yarnpkg.com/features/workspaces) describes local cross-references; [Vite 3's linked-dependency documentation](https://v3.vite.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies) requires ESM or explicit CommonJS conversion in both development and production. A Node-compatible default import of CommonJS alone does not establish browser compatibility.

### Recommended implementation

Implement the following as a separate migration:

- Keep the role data and function in `server/common/avalonlib.mjs`. Use a directly declared build dependency such as esbuild to generate `server/common/avalonlib.js` and `firebase/functions/common/avalonlib.js` with CommonJS output targeting Node 20. Preserve the existing `ROLES` and `getNumEvilForGameSize` exports and consumer paths.
- Mark generated files clearly and retain them in Git so a functions-only checkout or artifact remains self-contained. Provide a generator and a check mode that fails when either artifact differs from freshly generated output. Run the check in the committed-tree gate.
- Run generation before root server startup, client build, Storybook/test commands, and Firebase emulator/shell commands. Have the root generator work independently of the caller's current directory; keep generated output deterministic. The Nix build currently invokes `yarn build`, so that entry point must also generate the files.
- Add generation before the existing lint step in Firebase `predeploy`, using `$RESOURCE_DIR` to locate the functions package. Release preparation must run from a full repository checkout; a separately distributed functions artifact must already contain current generated code. Firebase documents [predeploy hooks and resource paths](https://firebase.google.com/docs/cli#pre_and_post_deploy_hooks).
- Regenerate dependency metadata with Yarn after declaring the build dependency. Preserve the repository's generated lockfile, PnP, and Nix dependency files through their generators.

A local, in-memory esbuild prototype converted the current ESM file to CommonJS twice with identical output. Loading that output as a standalone CommonJS module preserved all eight role objects and player-count results for 0 through 12 without requiring files from the repository. This establishes conversion feasibility, not deployment acceptance.

Before completing the migration, verify development and production client loading, the server's CommonJS API, and stats computation. Package the functions source and load its generated module from an isolated extracted archive; confirm both exports and the ASSASSIN role survive without access to `server/`. Change a rule and prove the stale-output check fails until regeneration. Run the full committed-HEAD precommit gate. No Firebase deployment was performed for this investigation.
