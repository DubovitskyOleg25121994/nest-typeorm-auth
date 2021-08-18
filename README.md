## Документация

- postman коллекция находится в папке /etc
- swagger - http://localhost:3000/api/docs/#

## Запуск проекта

Чтобы запустить проект локально, вам потребуется Docker и Docker Compose.

```bash
$ docker-compose up
```

Локальная разработка без развертывания бекенда через композицию. В данном варианте в контейнере будет только база данных.

```bash
$ docker-compose -f docker-compose.db.yml up -d
$ npm i
$ npm run start:dev
```

## Пользователь по умолчанию

```bash
$ "login": "admin@gmail.com"
$ "password": "admin"
```

## Описание работы с миграциями

- Для добавления новых изменений в продакшен обязательно необходимо генерировать файл с миграциям с изменениями в базе данных.
- Все миграции находятся в папке `migrations`.

### Обновить / загрузить все миграции в базу данных

```bash
$ npm run typeorm:migration:run
```

### Добавить новых файл миграции

```bash
$ npm run typeorm:migration:generate some-text
```

### Добавить пустой файл миграции

```bash
$ npm run typeorm:migration:create
```

### Отменить последнюю миграцию

```bash
$ npm run typeorm migration:revert
```
