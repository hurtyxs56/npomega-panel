#!/usr/bin/env bash
set -Eeuo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec bash "$HERE/full/v1/instaluj.sh" "$1"