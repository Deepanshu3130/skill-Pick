# Use Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Copy only server folder contents
COPY server/package*.json ./

RUN npm install

COPY server/. .

CMD ["node", "index.cjs"]
