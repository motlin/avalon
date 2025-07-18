# `just --list --unsorted`
default:
    @just --list --unsorted

# `yarn install`
install:
    yarn install

# `yarn storybook`
storybook: install
    yarn storybook

# `yarn build-storybook`
precommit: install
    yarn build-storybook
