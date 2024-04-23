#!/usr/bin/env bash

set -xe

C_ARGS="--target=wasm32 -Wall -Wextra -O0 --no-standard-libraries -fno-builtin -mbulk-memory -Wl,--allow-undefined -Wl,--export-all -Wl,--no-entry"
C_ARGS="$C_ARGS -I./src/"

# clang $C_ARGS -o ./render.wasm ./src/render.c
clang $C_ARGS -o ./sim.wasm ./src/sim.c