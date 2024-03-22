# builder
FROM node:20 as builder

WORKDIR /ksch-frontend

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY public/ public
COPY src/ src
COPY tasks.json tsconfig.json .
RUN yarn build


# runtime
FROM nginx:1.25 as runtime

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /ksch-frontend/build/ /usr/share/nginx/html
