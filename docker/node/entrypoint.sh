#!/bin/sh
set -e

echo "Running command '$*'"
exec /bin/sh -c "$*"
