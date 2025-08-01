"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tweetRoute_1 = __importDefault(require("./routes/tweetRoute"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Registrar rotas
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/tweets', tweetRoute_1.default);
// 404 handler (deve ser a última rota)
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});
// Error handler
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});
exports.default = app;
