FROM node:20-alpine

# Cài các gói cần thiết để build bcrypt
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

# Copy package.json và cài đặt lại toàn bộ dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy toàn bộ source code (không copy node_modules từ máy)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
