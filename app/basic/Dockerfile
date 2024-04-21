# basic/Dockerfile

FROM python:3.12

WORKDIR /basic-app
COPY . .
RUN pip install -r requirements.txt

ENV FLASK_RUN_PORT=5000
EXPOSE $FLASK_RUN_PORT

CMD flask run --host=0.0.0.0 --port=$FLASK_RUN_PORT
