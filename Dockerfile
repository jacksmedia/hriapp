FROM alpine
FROM python:3.10-alpine
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY requirements.txt /tmp/requirements.txt
RUN apk add --update py3-pip
RUN apk add musl-dev linux-headers g++ py3-scipy
ADD main.py .
ADD appy.js .
ADD CombeysRanking.csv .
ADD CombotsRanking.csv .
RUN npm install
RUN pip install -r /tmp/requirements.txt --force
RUN crontab -l | { cat; echo "0 */4 * * * python3 ./main.py"; } | crontab -
EXPOSE 3000
CMD ["crond"]