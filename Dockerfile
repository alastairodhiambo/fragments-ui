# Dockerfile for Fragments UI

# Stage 0: Install alpine Linux + node + dependencies
FROM node:16.14 AS dependencies

LABEL maintainer="Alastair Odhiambo <alastairodhiambo@outlook.com>"
LABEL description="Fragments UI testing web app"

WORKDIR /app

# copy dep files and install the production deps
COPY package* .
RUN npm ci

#######################################################################

# Stage 1: use dependencies to build the site
FROM node:16.14 AS builder

WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app
# Copy source code into the image
COPY . .
# Build the site to build/
RUN npm run build

########################################################################

# Stage 2: nginx web server to host the built site
FROM nginx:stable-alpine@sha256:74694f2de64c44787a81f0554aa45b281e468c0c58b8665fafceda624d31e556 AS deploy

# Put our build/ into /usr/share/nginx/html/ and host static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 1