FROM python:3.7-alpine

RUN apk update && apk add --no-cache supervisor docker git bash

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

ADD setup.py /tmp/setup.py
ADD MANIFEST.in /tmp/MANIFEST.in
ADD requirements.txt /tmp/requirements.txt
COPY galloper /tmp/galloper

RUN cd /tmp && python setup.py install && rm -rf /tmp/*
RUN mkdir /tmp/tasks
ADD start.sh /tmp/start.sh
RUN chmod +x /tmp/start.sh
WORKDIR /tmp
RUN pip install git+https://github.com/celery/celery.git
RUN pip install git+https://github.com/carrier-io/control_tower.git

SHELL ["/bin/bash", "-c"]

ENTRYPOINT ["/tmp/start.sh"]