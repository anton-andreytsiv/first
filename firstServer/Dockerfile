FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /app
#COPY package.json /app
COPY . .
RUN npm install 
EXPOSE 8000
RUN chown -R node /app
USER node
#CMD [ "npm", "run", "dev"]
RUN npx prisma generate
RUN npx prisma migrate
#RUN npm run seed2
CMD ["npm", "run", "dev"]
