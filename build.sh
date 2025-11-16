#!/bin/bash

echo "========================================"
echo "Building ToolVideo V2 Application"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if electron-builder is installed
if ! npm list electron-builder > /dev/null 2>&1; then
    echo "Installing electron-builder..."
    npm install --save-dev electron-builder
    echo ""
fi

# Detect OS and build accordingly
OS="$(uname -s)"
case "${OS}" in
    Linux*)
        echo "Building application for Linux..."
        npm run build:linux
        ;;
    Darwin*)
        echo "Building application for macOS..."
        npm run build:mac
        ;;
    MINGW*|MSYS*|CYGWIN*)
        echo "Building application for Windows..."
        npm run build:win
        ;;
    *)
        echo "Unknown OS: ${OS}"
        echo "Building with default settings..."
        npm run build
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Build completed successfully!"
    echo "Output directory: dist"
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "Build failed!"
    echo "========================================"
    exit 1
fi

