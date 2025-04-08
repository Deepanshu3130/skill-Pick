# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy all files into the container
COPY . .

# Install frontend and backend dependencies and build frontend
RUN npm run build

# Set working directory to server
WORKDIR /usr/src/app/server

# Start the backend server (which also serves frontend)
CMD ["node", "index.cjs"]
