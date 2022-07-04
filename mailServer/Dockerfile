FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /app
#COPY package.json /app
COPY . .
RUN npm install 
EXPOSE 9000
RUN chown -R node /app
USER node

CMD ["npm", "start"]
