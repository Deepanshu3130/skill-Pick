FROM ghcr.io/puppeteer/puppeteer:24.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install   # safer in dev mode

COPY . .

CMD ["node", "index.cjs"]
