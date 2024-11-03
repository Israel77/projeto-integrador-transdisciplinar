# --- Typescript build ---
# Compile the static files
FROM alpine

ENV NODE_VERSION=18.17.0

# Install Node.js and npm
RUN apk add --no-cache \
    libstdc++ \
    curl \
    && curl -fsSL https://unofficial-builds.nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64-musl.tar.xz | tar -xJ -C /usr/local --strip-components=1 \
    && apk del curl

# Verify installation
RUN node -v && npm -v

WORKDIR /usr/src/projeto-integrador-transdisciplinar/static

COPY . .

RUN npm ci

RUN npm run compile

CMD ["npm", "run", "start"]