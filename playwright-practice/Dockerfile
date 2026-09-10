# NOTE: https://playwright.dev/docs/docker
# -noble で ubuntu 24.04 上で playwright が使える　

# package.jsonに書かれているバージョンを、ビルド時に自動で読み取る(発展的な書き方)
# FROM mcr.microsoft.com/playwright:v1.63.0-noble
ARG PLAYWRIGHT_VERSION=1.62.1
FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

# -jammy で ubuntu 22.04 で playwright が使える
#FROM mcr.microsoft.com/playwright/python:v1.51.1-jammy

WORKDIR /var/scenario

# プロジェクトの依存関係をインストールする工程を追加
COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g @playwright/mcp@0.0.79
RUN npx playwright install chrome && npx playwright install-deps chrome

# テストコード自体もコンテナの中にコピーする
COPY . .

COPY ./scenario/entrypoint.sh /var/scenario/entrypoint.sh
RUN chmod +x /var/scenario/entrypoint.sh
ENTRYPOINT ["/var/scenario/entrypoint.sh"]
