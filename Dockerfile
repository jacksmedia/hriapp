FROM alpine
FROM python:3.10-alpine
ADD main.py
ADD appy.js
ADD CombeysRanking.csv
ADD CombotsRanking.csv
RUN node npm install fs express csv
RUN pip install requests pandas json
RUN crontab -l | { cat; echo "0 */4 * * * python3 ~/main.py"; } | crontab -
CMD ['crond']