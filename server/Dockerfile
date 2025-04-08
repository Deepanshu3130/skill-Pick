# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies as root (still root here)
RUN npm install

# Copy rest of the app
COPY . .

# Change ownership after everything is copied
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to pptruser for running the app
USER pptruser

CMD ["node", "index.cjs"]

