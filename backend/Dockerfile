FROM node:22-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json yarn.lock* ./
RUN yarn install

# Copy the rest of the code
COPY . .
RUN yarn build
EXPOSE 5001

# Start in development mode with watch enabled
CMD ["yarn", "start:prod"]