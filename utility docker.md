// backup
docker exec mongodb mongodump \
 --username admin \
 --password secretpassword \
 --authenticationDatabase admin \
 --db travelswipe \
 --out /data/backup

// Restore
docker exec mongodb mongorestore \
 --username admin \
 --password secretpassword \
 --authenticationDatabase admin \
 /data/backup/travelswipe

docker-compose build frontend

docker build --no-cache -t lucianxconst/travelswipe-backend:latest ./backend
docker push lucianxconst/travelswipe-backend:latest

For Local Development (The "Development" stage)
You don't even need to change your docker-compose.yml. But if you want to build just the dev part manually:

docker build --target development -t travelswipe-fe:dev ./frontend

For Azure (The "Production" stage)
When you build for the cloud, Docker will automatically see the production stage as the final one:

# Build for production (AMD64 for Azure compatibility)

docker build --platform linux/amd64 -t lucianxconst/travelswipe-frontend:latest ./frontend

# Push to Hub

docker push lucianxconst/travelswipe-frontend:latest
