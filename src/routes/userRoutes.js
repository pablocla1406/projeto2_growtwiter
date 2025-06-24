"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = require("../controllers/userController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Todas as rotas de usuário requerem autenticação
router.use(auth_1.authenticateToken);
// GET /users/:id - Obter dados de um usuário
router.get('/:id', userController_1.UserController.getUser);
// POST /users/:id/follow - Seguir um usuário
router.post('/:id/follow', userController_1.UserController.followUser);
// DELETE /users/:id/follow - Deixar de seguir um usuário
router.delete('/:id/follow', userController_1.UserController.unfollowUser);
exports.default = router;
