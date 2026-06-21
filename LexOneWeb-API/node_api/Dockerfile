FROM node:18-bullseye

WORKDIR /app
ENV NODE_ENV=production \
    API_PORT=3000 \
    CHAT_PORT=8081 \
    SSL=0

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY languageCode.json ./

EXPOSE 3000 8081

CMD ["node", "src/app.js"]
