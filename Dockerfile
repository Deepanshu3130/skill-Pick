ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY server/package*.json ./

# Install production dependencies
RUN npm install --production && npm cache clean --force

# Copy rest of the app (assuming Dockerfile is in root and "server" folder exists)
COPY server/. .

# Start the server
CMD ["node", "index.cjs"]
