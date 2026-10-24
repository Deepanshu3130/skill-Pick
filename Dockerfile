FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Accept frontend env var as build ARG
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Copy project files
COPY . .

# Build frontend
WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm run build

# Install server dependencies
WORKDIR /usr/src/app/server
RUN npm install --omit=dev

# Start backend
CMD ["npm", "start"]
