FROM phusion/baseimage:0.9.19
MAINTAINER Chris Mitchell

CMD ["/sbin/my_init"]

USER root
RUN apt-get update && apt-get install -y \
    npm \
    python2.7

RUN curl --silent --show-error --retry 5 https://bootstrap.pypa.io/get-pip.py | python
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm cache clean -f
RUN npm install -g n
RUN n stable

RUN mkdir /escher
WORKDIR /escher
COPY package.json package.json

RUN npm install

COPY Gruntfile.js Gruntfile.js
COPY css /escher/css
COPY js /escher/js
RUN npm run-script compile

RUN mkdir -p /etc/my_init.d
ADD docker/run-escher.sh /etc/my_init.d/99-run-escher.sh
RUN chmod +x /etc/my_init.d/*

COPY . /escher
WORKDIR /escher/py
RUN pip install .

# port we listen to
EXPOSE 80
