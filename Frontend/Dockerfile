FROM node:22-alpine3.18 AS angular

# Set the working directory inside the container
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json first to leverage Docker cache for npm install
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the Angular application code
COPY . .

# Expose port 4200 for the Angular development server
EXPOSE 4200

# Start the Angular development server
CMD ["npm", "start"]
