#!/bin/zsh

sudo chown -R bun:bun node_modules
bun install --frozen-lockfile
