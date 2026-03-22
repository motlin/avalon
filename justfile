# `just --list --unsorted`
default:
    @just --list --unsorted

# `yarn install`
install:
    yarn install

# Build common + client for production
build: install
    yarn build

# Lint client code
lint-client: install
    yarn workspace @avalon/client lint

# Lint server code
lint-server: install
    yarn workspace @avalon/server lint

# Lint all code
lint: lint-client lint-server

# Run E2E flow tests (starts dev server automatically)
test: install
    #!/usr/bin/env bash
    set -euo pipefail
    ROOT="{{justfile_directory()}}"
    cd "$ROOT/client" && yarn dev &
    DEV_PID=$!
    trap "kill $DEV_PID 2>/dev/null || true" EXIT
    for i in $(seq 1 30); do
        if curl -s http://localhost:5173/ > /dev/null 2>&1; then
            break
        fi
        sleep 1
    done
    cd "$ROOT" && yarn test

# Runs all precommit checks
precommit: build lint test
