FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# 1. First install frontend dependencies (including devDependencies)
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json .
RUN npm install --include=dev

# 2. Then install backend dependencies
WORKDIR /usr/src/app/server
COPY server/package*.json .
RUN npm install --production

# 3. Copy remaining files
WORKDIR /usr/src/app
COPY . .

# 4. Build frontend
WORKDIR /usr/src/app/frontend
RUN npm run build

# 5. Fix permissions properly
USER root
RUN chown -R pptruser:pptruser /usr/src/app && \
    chmod -R o+rwx /home/pptruser
USER pptruser

# 6. Run server
WORKDIR /usr/src/app/server
CMD ["node", "index.cjs"]