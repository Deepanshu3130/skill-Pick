FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Use root to handle installations
USER root

# Set working directory
WORKDIR /usr/src/app

# Copy everything into the container
COPY . .

# Set permissions so npm can write to folders
RUN chmod -R 777 /usr/src/app

# Install and build
RUN npm install --prefix server && \
    npm install --prefix frontend && \
    npm run build --prefix frontend

# Optional: switch back to non-root user if needed
# USER pptruser

# Set working dir to server and run server
WORKDIR /usr/src/app/server
CMD ["node", "index.cjs"]
