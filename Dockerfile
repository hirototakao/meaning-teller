FROM --platform=linux/x86_64 node:18.15.0-slim

RUN apt-get update && \
    apt-get install -y locales git procps
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libasound2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libxshmfence1 \
  libxss1 \
  libxtst6 \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
RUN locale-gen ja_JP.UTF-8
RUN localedef -f UTF-8 -i ja_JP ja_JP
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo
RUN useradd bot-todo -m
USER bot-todo
WORKDIR /meaning-teller