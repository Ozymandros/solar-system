FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY index.html style.css main.js ./
COPY src/ ./src/
COPY textures/ ./textures/

EXPOSE 80
