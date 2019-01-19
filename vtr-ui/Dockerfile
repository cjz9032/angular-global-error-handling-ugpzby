FROM nginx:alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY /dist/vtr-ui /usr/share/nginx/html/vtr-ui
CMD ["nginx", "-g", "daemon off;"]
