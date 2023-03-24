const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../milddleware/authMiddleware');

// Регистрация пользователя
router.post('/registration', userController.registration);

// Аутентификация пользователя
router.post('/login', userController.login);

// Проверка авторизации пользователя
router.get('/auth',authMiddleware, userController.check);

// Получение списка всех пользователей
router.get('/users', userController.getListUsers); 

// Обновление данных пользователя по id
router.put('/users/:id',userController.dataUpdateId);

// Удаление пользователя по id
router.delete('/users/:id', userController.deleteUserId);
  
module.exports = router;
