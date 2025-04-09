# FROM ghcr.io/puppeteer/puppeteer:24.2.1

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# # 1. Base setup
# USER root
# RUN mkdir -p /usr/src/app && \
#     chown -R pptruser:pptruser /usr/src/app

# # 2. Frontend install
# WORKDIR /usr/src/app/frontend
# COPY --chown=pptruser:pptruser frontend/package*.json .

# USER root
# RUN mkdir -p /usr/src/app/frontend/node_modules && \
#     chown -R pptruser:pptruser /usr/src/app/frontend

# USER pptruser
# RUN npm install --include=dev --unsafe-perm

# # 3. Backend install (fixed section)
# USER root
# WORKDIR /usr/src/app/server
# COPY --chown=pptruser:pptruser server/package*.json .
# RUN mkdir -p node_modules && chown pptruser:pptruser node_modules
# USER pptruser
# RUN npm install --production --unsafe-perm

# # 4. Copy remaining files
# USER root
# COPY --chown=pptruser:pptruser . .
# RUN chmod -R o+rwx /home/pptruser

# # 5. Build frontend
# USER pptruser
# WORKDIR /usr/src/app/frontend
# RUN npm run build

# # 6. Run server
# WORKDIR /usr/src/app/server
# CMD ["node", "index.cjs"]


# 0. Set global env vars
FROM ghcr.io/puppeteer/puppeteer:24.2.1

# 0. Set global env vars
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
 PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

# 1. Accept frontend env var as build ARG
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# 2. Base setup
USER root
WORKDIR /usr/src/app

# 3. Copy project files
COPY --chown=pptruser:pptruser . .

# 4. Install frontend dependencies and build
USER pptruser
WORKDIR /usr/src/app/frontend
RUN npm install --include=dev
RUN npm run build

# 5. Install backend dependencies
WORKDIR /usr/src/app/server
RUN npm install --production

# 6. Start backend
CMD ["npm", "start"]
