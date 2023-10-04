FROM alpine
FROM python:3.10-alpine
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update py3-pip
ADD main.py .
ADD appy.js .
ADD CombeysRanking.csv .
ADD CombotsRanking.csv .
RUN npm install
RUN pip install requests pandas json
RUN crontab -l | { cat; echo "0 */4 * * * python3 ./main.py"; } | crontab -
EXPOSE 3000
CMD ["crond"]