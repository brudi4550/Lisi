# Use an official Node runtime as a parent image
FROM node:20.12.2-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (use the environment variable)
EXPOSE ${BACKEND_PORT}

# Define the command to run the app
CMD ["node", "src/index.js"]
