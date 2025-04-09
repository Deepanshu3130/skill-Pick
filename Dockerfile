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


FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# 1. Base setup
USER root
WORKDIR /usr/src/app

# 2. Copy entire project
COPY --chown=pptruser:pptruser . .

# 3. Set ownership
RUN chown -R pptruser:pptruser /usr/src/app

# 4. Build frontend and backend dependencies
USER pptruser
RUN npm install && npm run build

# 5. Set working dir to backend
WORKDIR /usr/src/app/server

# 6. Start backend
CMD ["npm", "start"]
