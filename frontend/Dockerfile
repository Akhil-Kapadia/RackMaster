FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy sources and build static assets
COPY . /app/
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
