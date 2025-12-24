FROM node:25 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src src
COPY static static
COPY webpack.config.js .
COPY .babelrc .
RUN npm run build

FROM nginx
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]