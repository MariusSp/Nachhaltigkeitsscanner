FROM node:current-alpine as builder
WORKDIR '/app'
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build -- --prod

FROM nginx
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/webapp /usr/share/nginx/html
