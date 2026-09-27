# zensimlabs.com

The landing page for [zensim](https://github.com/zensimlabs/zensim), and the
installer it serves at `/install.sh`.

Next.js in static export mode, deployed to Cloudflare Pages. Nothing runs on a
server: the page is HTML and the installer is a shell script beside it.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into out/
npm run deploy   # build, then wrangler pages deploy
```

## The installer

`public/install.sh` is what `curl -fsSL https://zensimlabs.com/install.sh | sh`
runs. It reads the latest release of the simulator from GitHub, checks the
SHA-256 in `checksums.txt` against the archive, and installs the binary into
`~/.local/bin` and the platform library into the platform data directory. It
clones nothing and compiles nothing.

Variables it honours: `ZENSIM_VERSION`, `ZENSIM_INSTALL_DIR`,
`ZENSIM_NO_MODIFY_PATH`.

Releases are mirrored into the R2 bucket `zensim-dl` under `v<version>/`; the
installer reads GitHub, which fronts a CDN and needs no credentials.

## Deploying

Cloudflare credentials belong in the environment, never in this repository:

```sh
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_API_TOKEN=...
npm run deploy
```
