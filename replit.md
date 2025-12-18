# ARCH WEEKEND Website

## Overview
This is a SvelteKit-based website for ARCH WEEKEND - an architectural workshop/intensive course focused on algorithmic design, generative art, and game development for architects and designers. The site showcases past workshops and allows registration for upcoming events.

## Project Structure
- **Framework**: SvelteKit (v2.0)
- **3D Graphics**: Three.js via Threlte
- **Build Tool**: Vite
- **Language**: JavaScript with JSDoc type annotations

## Key Features
- Interactive 3D visualizations (currently disabled in favor of video)
- Event registration with popup modals
- Multiple workshop pages (vol 1.0, 2.0, 3.0, 4.0)
- Video and image galleries
- Responsive grid layout

## Development Setup
- Dev server runs on port 5000
- Configured for Replit environment with proper host settings
- HMR (Hot Module Replacement) configured for WSS protocol

## Dependencies
- **Core**: svelte, @sveltejs/kit, vite
- **3D Graphics**: three, @threlte/core, @threlte/extras
- **Dev Tools**: typescript, eslint, prettier

## Recent Changes
- November 19, 2025: Initial setup for Replit environment
  - Configured Vite to bind to 0.0.0.0:5000
  - Set up HMR for Replit's proxy environment
  - Installed all dependencies
  - Created development workflow

## Architecture
The application follows SvelteKit's file-based routing:
- `/src/routes/+page.svelte` - Main landing page
- `/src/routes/oferta/` - Offer page
- `/src/routes/privacy-policy/` - Privacy policy
- `/src/routes/register/` - Registration page
- `/src/routes/requisites/` - Requisites page
- `/src/lib/` - Shared components and assets

## Static Assets
- GLB 3D models stored in `/static/assets/`
- Images and videos in `/src/lib/images/`
