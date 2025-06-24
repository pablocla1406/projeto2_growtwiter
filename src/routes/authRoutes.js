"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var router = (0, express_1.Router)();
// POST /auth/register - Cadastrar novo usuário
router.post('/register', authController_1.AuthController.register);
// POST /auth/login - Fazer login
router.post('/login', authController_1.AuthController.login);
exports.default = router;
