FROM ghcr.io/puppeteer/puppeteer:24.2.1

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
   
# 1. Set up directories with proper permissions
USER root
RUN mkdir -p /usr/src/app/frontend && \
    chown -R pptruser:pptruser /usr/src/app

# 2. Frontend dependencies
WORKDIR /usr/src/app/frontend
COPY --chown=pptruser:pptruser frontend/package*.json .
USER pptruser
RUN npm install --include=dev --unsafe-perm

# 3. Backend dependencies
USER root
WORKDIR /usr/src/app/server
COPY --chown=pptruser:pptruser server/package*.json .
USER pptruser
RUN npm install --production

# 4. Copy remaining files
USER root
COPY --chown=pptruser:pptruser . .
RUN chmod -R o+rwx /home/pptruser

# 5. Build frontend
USER pptruser
WORKDIR /usr/src/app/frontend
RUN npm run build

# 6. Run server
WORKDIR /usr/src/app/server
CMD ["node", "index.cjs"]