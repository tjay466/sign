# Stage 1: Build front-end
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:22-slim
WORKDIR /app
COPY --from=builder /app /app
RUN mkdir -p /app/data
EXPOSE 3000
CMD ["npm", "start"]
