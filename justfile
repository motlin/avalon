# `just --list --unsorted`
default:
    @just --list --unsorted

# Configure git-test with clean-tree checks and commit skip logic
setup-git-test:
    git test add --test default 'just --global-justfile _check-local-modifications && (should-skip-commit || just precommit) && just --global-justfile _check-local-modifications' --forget

# `yarn install`
install:
    yarn install

# `yarn storybook`
storybook: install
    yarn storybook

# `yarn build-storybook`
build-storybook: install
    yarn build-storybook

# `yarn test-storybook` - Run tests using Storybook test runner
test-storybook: install
    yarn test-storybook

# `yarn playwright install chromium` - Install the browser build this Playwright version needs
install-browsers: install
    yarn playwright install chromium

# `yarn test:vitest` - Run tests using Vitest addon
test-vitest: install-browsers build-storybook
    yarn test:vitest

# Runs all precommit checks
precommit: test-vitest
