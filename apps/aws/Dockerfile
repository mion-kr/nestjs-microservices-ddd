FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY prisma ./prisma/

RUN npm install -g pnpm

# RUN pnpm install
#RUN pnpm install --frozen-lockfile

# node_modules 파일을 제외하기 위해선 .dockerignore 파일을 사용해야 합니다.
# COPY . .

COPY apps/aws apps/aws
COPY libs libs


RUN pnpm install -r --frozen-lockfile 

RUN npx prisma generate

RUN pnpm run build aws

# ---
FROM node:alpine as production

# ARG 빌드 시 재정의할 수 있는 변수를 정의 합니다.
ARG NODE_ENV=production 

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

# RUN pnpm install --prod
RUN pnpm install --frozen-lockfile --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/aws/main"]