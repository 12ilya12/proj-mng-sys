FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build \
    #Генерируем файлы миграции, применяем их к базе и заполняем базу начальными значениями, запускаем приложение.
    #Не уверен, что подготавливать базу надо при каждом запуске контейнера...
    && printf "ls\nnpm run drizzle:generate\nnpm run drizzle:push\nnpm run drizzle:seed\nnpm run start:dev" > prepareDB.sh

CMD [ "/bin/sh", "prepareDB.sh" ]