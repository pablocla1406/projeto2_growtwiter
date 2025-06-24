"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var dotenv_1 = require("dotenv");
// Importar rotas
var authRoutes_1 = require("./routes/authRoutes");
var userRoutes_1 = require("./routes/userRoutes");
var tweetRoutes_1 = require("./routes/tweetRoutes");
// Configurar variáveis de ambiente
(0, dotenv_1.config)();
var app = (0, express_1.default)();
// Middlewares de segurança e logging
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
// Middleware para parsing JSON
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rotas
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/tweets', tweetRoutes_1.default);
// Rota de health check
app.get('/health', function (req, res) {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Middleware para rotas não encontradas
app.use('*', function (req, res) {
    res.status(404).json({ error: 'Rota não encontrada' });
});
// Middleware de tratamento de erros
app.use(function (error, req, res, next) {
    console.error('Erro não tratado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});
exports.default = app;
