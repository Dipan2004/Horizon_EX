# Horizon Chrome Extension

A Chrome Extension version of the Horizon AI Interview Assistant.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this `extension` folder
4. The Horizon extension will appear in your browser toolbar

## Features

- **Real-time Assistant**: Voice recognition for live interview support
- **Resume Upload**: Analyze your resume with AI
- **Mock Interview**: Practice with AI-generated questions
- **Company Research**: Get insights about companies and roles
- **Interview History**: Track your progress over time

## Usage

1. Click the Horizon extension icon in your browser toolbar
2. Use the "Start" button to begin real-time assistance
3. Click on feature cards to access different tools
4. The extension works offline for basic features

## Development

This extension is built from the main Horizon web application with:
- Manifest v3 compliance
- Popup-based interface
- Local storage for data persistence
- Speech recognition for real-time assistance

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Main interface
- `icon-*.png` - Extension icons (16px, 48px, 128px)

## Permissions

- `storage` - For saving user preferences and data locally
- No network permissions required for basic functionality