#!/bin/sh
# Install zensim: a deterministic full-system simulator for STM32 firmware.
#
#   curl -fsSL https://zensimlabs.com/install.sh | sh
#
# It downloads a release from GitHub, checks its SHA-256, and installs the
# binary and the platform library. Nothing is cloned and nothing is compiled.
#
#   ZENSIM_VERSION=0.1.0     a version instead of the latest release
#   ZENSIM_INSTALL_DIR=DIR   where the binary goes (default ~/.local/bin)
#   ZENSIM_NO_MODIFY_PATH=1  do not touch your shell rc files
#
# Copyright (C) 2026 Zensim Labs. SPDX-License-Identifier: AGPL-3.0-only

set -eu

REPO="zensimlabs/zensim"
VERSION="${ZENSIM_VERSION:-latest}"
INSTALL_DIR="${ZENSIM_INSTALL_DIR:-$HOME/.local/bin}"

die() { printf '\nzensim install: %s\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

os="$(uname -s)"
arch="$(uname -m)"
case "$os-$arch" in
  Darwin-arm64)        target="aarch64-apple-darwin" ;;
  Darwin-x86_64)       target="x86_64-apple-darwin" ;;
  Linux-x86_64)        target="x86_64-unknown-linux-gnu" ;;
  Linux-aarch64)       target="aarch64-unknown-linux-gnu" ;;
  *) die "no prebuilt binary for $os $arch yet.
  Build it instead — it needs only a Rust toolchain:
    git clone https://github.com/$REPO && cd zensim && ./install.sh" ;;
esac

case "$os" in
  Darwin) data_dir="$HOME/Library/Application Support/zensim" ;;
  Linux)  data_dir="${XDG_DATA_HOME:-$HOME/.local/share}/zensim" ;;
esac
lib_dir="$data_dir/lib"
env_script="$data_dir/env"

have curl || die "curl is required"
have tar || die "tar is required"
if have shasum; then sha="shasum -a 256"
elif have sha256sum; then sha="sha256sum"
else sha=""; fi

if [ "$VERSION" = latest ]; then
  base="https://github.com/$REPO/releases/latest/download"
  tag="$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
        | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p' | head -1)"
  [ -n "$tag" ] || die "no release published yet for $REPO"
  VERSION="${tag#v}"
else
  base="https://github.com/$REPO/releases/download/v$VERSION"
fi

file="zensim-$VERSION-$target.tar.gz"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT INT TERM

printf 'zensim %s for %s\n' "$VERSION" "$target"
curl -fsSL --retry 3 -o "$tmp/$file" "$base/$file" \
  || die "no build for $target in release v$VERSION ($base/$file)"

if [ -n "$sha" ] && curl -fsSL -o "$tmp/checksums.txt" "$base/checksums.txt" 2>/dev/null; then
  want="$(sed -n "s/^\([0-9a-f]\{64\}\)  *$file\$/\1/p" "$tmp/checksums.txt" | head -1)"
  if [ -n "$want" ]; then
    got="$($sha "$tmp/$file" | cut -d' ' -f1)"
    [ "$want" = "$got" ] || die "checksum mismatch for $file
  expected $want
  got      $got"
    printf 'checksum ok\n'
  fi
fi

tar xzf "$tmp/$file" -C "$tmp"
[ -x "$tmp/zensim" ] || die "the archive holds no zensim binary"

mkdir -p "$INSTALL_DIR" "$data_dir"
install -m 0755 "$tmp/zensim" "$INSTALL_DIR/zensim" 2>/dev/null \
  || { cp "$tmp/zensim" "$INSTALL_DIR/zensim" && chmod 0755 "$INSTALL_DIR/zensim"; }
rm -rf "$lib_dir"
cp -R "$tmp/lib" "$lib_dir"

cat > "$env_script" <<EOF
case ":\${PATH}:" in
  *:"$INSTALL_DIR":*) ;;
  *) export PATH="$INSTALL_DIR:\$PATH" ;;
esac
export ZENSIM_LIB="\${ZENSIM_LIB:-$lib_dir}"
EOF

if [ -z "${ZENSIM_NO_MODIFY_PATH:-}" ]; then
  line=". \"$env_script\""
  for rc in "$HOME/.profile" "$HOME/.bashrc" "$HOME/.zshrc"; do
    [ -e "$rc" ] || [ "$rc" = "$HOME/.profile" ] || continue
    touch "$rc"
    grep -Fqx "$line" "$rc" || printf '\n%s\n' "$line" >> "$rc"
  done
  if [ -d "$HOME/.config/fish" ]; then
    mkdir -p "$HOME/.config/fish/conf.d"
    {
      printf 'fish_add_path "%s"\n' "$INSTALL_DIR"
      printf 'set -q ZENSIM_LIB; or set -gx ZENSIM_LIB "%s"\n' "$lib_dir"
    } > "$HOME/.config/fish/conf.d/zensim.env.fish"
  fi
fi

printf '\ninstalled %s to %s/zensim\n' "$("$INSTALL_DIR/zensim" --version 2>/dev/null || echo zensim)" "$INSTALL_DIR"
printf 'installed the platform library to %s\n' "$lib_dir"
if [ -z "${ZENSIM_NO_MODIFY_PATH:-}" ]; then
  printf 'wrote %s; restart your shell or run: . "%s"\n' "$env_script" "$env_script"
else
  printf 'wrote %s; source it yourself, nothing else was changed\n' "$env_script"
fi
printf '\ncheck it:  zensim show //boards/st/nucleo_h743zi.star\n'
