# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Give permission to write in the working directory
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to pptruser (the default user in this base image)
USER pptruser

# Copy only package files
COPY server/package*.json ./

RUN npm install

# Copy rest of the app
COPY server/. .

CMD ["node", "index.cjs"]
