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
runs. It reads `dl.zensimlabs.com/latest/version`, downloads the archive for
the host's target, checks the SHA-256 in `checksums.txt` against it, and
installs the binary into `~/.local/bin` and the platform library into the
platform data directory. It clones nothing and compiles nothing.

Variables it honours: `ZENSIM_VERSION`, `ZENSIM_INSTALL_DIR`,
`ZENSIM_NO_MODIFY_PATH`, `ZENSIM_DOWNLOAD_BASE`.

`dl.zensimlabs.com` is the R2 bucket `zensim-dl`: `latest/` holds the archive,
its `checksums.txt` and a `version` marker, and `v<version>/` keeps each
release. Publishing a release means uploading there — the installer does not
depend on the source repository being readable.

## Deploying

Cloudflare credentials belong in the environment, never in this repository:

```sh
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_API_TOKEN=...
npm run deploy
```
