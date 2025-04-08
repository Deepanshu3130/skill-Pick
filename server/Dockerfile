# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy only package files first (as root)
COPY server/package*.json ./

# Install dependencies as root
RUN npm install

# Change ownership of all files to pptruser
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to pptruser (the default user in this base image)
USER pptruser

# Copy rest of the app
COPY server/. .

CMD ["node", "index.cjs"]