# Stage 1: Build the React application
FROM node:14 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the React application with nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy and process the nginx configuration template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Use envsubst to replace the placeholder with the actual value
RUN envsubst '${FRONTEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE ${FRONTEND_PORT}

# No CMD needed, nginx starts by default
