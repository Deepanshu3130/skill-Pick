FROM ghcr.io/puppeteer/puppeteer:24.2.1

# Configure Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Set up app directory
RUN mkdir -p /usr/src/app && \
    chown -R pptruser:pptruser /usr/src/app
WORKDIR /usr/src/app

# Copy backend dependencies
COPY --chown=pptruser:pptruser server/package*.json ./

# Install backend deps (as non-root)
USER pptruser
RUN npm install --production

# Copy pre-built frontend and backend code
COPY --chown=pptruser:pptruser frontend/dist ./frontend/dist
COPY --chown=pptruser:pptruser server ./

# Fix Puppeteer permissions (temporarily switch to root)
USER root
RUN chmod -R o+rwx /home/pptruser \
    && chmod -R o+rwx /usr/src/app/node_modules/puppeteer/.local-chromium
USER pptruser

# Start the server
CMD ["node", "index.cjs"]