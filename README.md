##REST-сервис для юзеров (Koa.js, MongoDB)

User имеет поля name, description, priсe, даты создания и модификации и _id.

GET /users/:id - получить юзера c таким id
GET /users - получить массив юзеров
PUT /users - создать юзера
PATCH /users/:id - обновить юзера
DELETE /users/:id - удалить юзера

PUT, PATCH, DELETE можно протестить через curl или POSTMAN

Все методы оперируют только с публичными полями (нельзя при создании юзера указать его _id)
Публичными являются name, description, priсe.

Если юзера нет: возвращает 404
Если ошибка валидации: возвращает 400

Для запуска сервера запускаем gulp nodemon
для загрузки тестовых юзеров запускаем  gulp db:load --from fixtures/users