# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first
COPY package*.json ./

# Install dependencies (as root)
RUN npm install

# Copy rest of the app
COPY . .

# Change ownership to pptruser using UID/GID
RUN chown -R 1000:1000 /usr/src/app

# Switch to non-root user (pptruser = UID 1000)
USER pptruser

# Start the app
CMD ["node", "index.cjs"]
