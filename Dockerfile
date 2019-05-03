FROM python:3.7

RUN apt update

RUN apt upgrade -y

RUN apt install openjdk-8-jre-headless openjdk-8-jdk-headless -y

COPY ./app /app

WORKDIR /app

RUN pip install -r requirements.txt

RUN python3 fetch_wordnet.py
