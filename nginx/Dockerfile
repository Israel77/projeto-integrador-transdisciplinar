FROM docker.io/library/nginx:latest
COPY ./server.crt /etc/nginx/ssl/server.crt
COPY ./server.key /etc/nginx/ssl/server.key
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
