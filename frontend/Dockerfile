# Dev-only image. Production build is a separate target (TBD).
FROM node:20-alpine

ENV CI=true

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
