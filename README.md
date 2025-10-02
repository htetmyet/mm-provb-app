<div align="center">
<img width="1200" height="475" alt="Myanmar PocketBook banner" src="./components/img/mm-web-banner.png" />
</div>

# Myanmar Words and Proverbs Dictionary

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy with Docker

Build and run a production-ready container that serves the compiled Vite output through Nginx:

```bash
# Build the image (replace the tag as needed)
docker build -t mm-proverb .

# Run the container and expose it on port 6060
docker run --rm -p 6060:80 mm-proverb
```

Once the container is running, the app is available at http://localhost:6060.

## Docker Compose

Alternatively, use Docker Compose for a one-command build and run:

```bash
docker compose build
docker compose up -d
```

The app will be served on http://localhost:8080 and can be stopped with `docker compose down`.
