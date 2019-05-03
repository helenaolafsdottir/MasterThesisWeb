FROM heroku/heroku:18

RUN apt update

#RUN apt upgrade -y

RUN apt install python3.7 python3-pip openjdk-8-jre-headless openjdk-8-jdk-headless -y

COPY ./app /app

WORKDIR /app

RUN python3.7 -m pip install -r requirements.txt

RUN python3.7 fetch_wordnet.py

CMD python3.7 /app/api.py
