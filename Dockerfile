FROM debian:buster-slim

RUN apt update

RUN apt install python3-dev python3-venv openjdk-8-jdk openjdk-8-jre

