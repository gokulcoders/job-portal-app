# Frontend App (React + Vite + MobX + Tailwind + Docker)

## Local dev
npm install
npm run dev

## Production build
npm run build
npm run preview

## Docker (production, nginx)
docker compose up --build
# app at http://localhost:8080

## Docker (dev, hot reload)
docker build -f Dockerfile.dev -t frontend-dev .
docker run -p 5173:5173 -v $(pwd):/app frontend-dev
