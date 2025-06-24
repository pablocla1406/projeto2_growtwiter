"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var prisma_1 = require("../utils/prisma");
var auth_1 = require("../utils/auth");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    // Cadastrar novo usuário
    AuthController.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_1, username, email, password, profileImage, existingUser, hashedPassword, user, token, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, name_1 = _a.name, username = _a.username, email = _a.email, password = _a.password, profileImage = _a.profileImage;
                        // Validações básicas
                        if (!name_1 || !username || !email || !password) {
                            res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { username: username },
                                        { email: email }
                                    ]
                                }
                            })];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser) {
                            res.status(409).json({ error: 'Username ou email já estão em uso' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, auth_1.AuthUtils.hashPassword(password)];
                    case 2:
                        hashedPassword = _b.sent();
                        return [4 /*yield*/, prisma_1.prisma.user.create({
                                data: {
                                    name: name_1,
                                    username: username,
                                    email: email,
                                    password: hashedPassword,
                                    profileImage: profileImage
                                },
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    email: true,
                                    profileImage: true,
                                    createdAt: true
                                }
                            })];
                    case 3:
                        user = _b.sent();
                        token = auth_1.AuthUtils.generateToken(user.id);
                        res.status(201).json({
                            message: 'Usuário criado com sucesso',
                            user: user,
                            token: token
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error('Erro ao registrar usuário:', error_1);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Fazer login
    AuthController.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, login, password, user, isPasswordValid, token, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, login = _a.login, password = _a.password;
                        // Validações básicas
                        if (!login || !password) {
                            res.status(400).json({ error: 'Login e senha são obrigatórios' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { username: login },
                                        { email: login }
                                    ]
                                }
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            res.status(401).json({ error: 'Credenciais inválidas' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, auth_1.AuthUtils.comparePassword(password, user.password)];
                    case 2:
                        isPasswordValid = _b.sent();
                        if (!isPasswordValid) {
                            res.status(401).json({ error: 'Credenciais inválidas' });
                            return [2 /*return*/];
                        }
                        token = auth_1.AuthUtils.generateToken(user.id);
                        res.json({
                            message: 'Login realizado com sucesso',
                            user: {
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                email: user.email,
                                profileImage: user.profileImage,
                                createdAt: user.createdAt
                            },
                            token: token
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error('Erro ao fazer login:', error_2);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
