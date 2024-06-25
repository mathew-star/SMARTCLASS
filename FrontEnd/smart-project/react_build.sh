#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies (if necessary)
npm install

# Build the React app
npm run build
