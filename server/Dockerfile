# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Create app directory and set proper permissions
RUN mkdir -p /usr/src/app && \
    chown -R pptruser:pptruser /usr/src/app

WORKDIR /usr/src/app

# Copy package files as pptruser
COPY --chown=pptruser:pptruser server/package*.json ./

# Switch to pptruser
USER pptruser

# Install dependencies
RUN npm install --unsafe-perm

# Copy rest of the app as pptruser
COPY --chown=pptruser:pptruser server/. .

CMD ["node", "index.cjs"]