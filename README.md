# Three.js Decal Experiments

A Svelte-based project exploring Three.js decals using Threlte. This project demonstrates the implementation of decal techniques in 3D web graphics.

## Tech Stack

- [Svelte](https://svelte.dev/) - Frontend framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [Threlte](https://threlte.xyz/) - Three.js components for Svelte
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety and enhanced developer experience
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm, pnpm, or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn
```

### Development

Start the development server:

```bash
npm run dev
# or
npm run dev -- --open # to open in browser automatically
```

### Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Scripts

- `dev`: Start development server
- `build`: Create production build
- `preview`: Preview production build
- `check`: Run Svelte-Kit sync and TypeScript checks
- `format`: Format code with Prettier
- `lint`: Run linting checks

## Project Structure

- `/src` - Source code
  - `/routes` - Svelte routes/pages
  - `/lib` - Shared components and utilities
- `/static` - Static assets
