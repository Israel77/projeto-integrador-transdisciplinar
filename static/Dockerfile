# --- Typescript build ---
# Compile the static files
FROM docker.io/library/alpine:3.20

ENV NODE_VERSION=22.2.0

# Install Node.js and npm
RUN apk add --no-cache \
    libstdc++ \
    curl \
    git \
    && curl -fsSL https://unofficial-builds.nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64-musl.tar.xz | tar -xJ -C /usr/local --strip-components=1 \
    && apk del curl

# Verify installation
RUN node -v && npm -v

WORKDIR /usr/src/projeto-integrador-transdisciplinar/static

COPY . .

RUN npm ci

ARG CACHEBUST=1
RUN npm run compile

RUN git config --global user.email "ci@example.com"
RUN git config --global user.name "CI"
RUN git init
RUN git add .
RUN git commit -m "Reference commit" 
RUN git log --format=%H -n 1 > hash

CMD ["npm", "run", "docker-start"]