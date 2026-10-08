# Use official lightweight Nginx image based on Alpine Linux
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove the default Nginx welcome page
RUN rm -rf ./*

# Copy our website files into the container
COPY index.html .
COPY style.css .

# Tell Docker this container listens on port 80
EXPOSE 80

# Nginx starts automatically — no CMD needed for nginx:alpine
