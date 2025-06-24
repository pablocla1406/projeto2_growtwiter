"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.TweetController = void 0;
var prisma_1 = require("../utils/prisma");
var TweetController = /** @class */ (function () {
    function TweetController() {
    }
    // Criar um tweet
    TweetController.createTweet = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var content, authorId, tweet, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        content = req.body.content;
                        authorId = req.userId;
                        // Validações básicas
                        if (!content || content.trim().length === 0) {
                            res.status(400).json({ error: 'O conteúdo do tweet é obrigatório' });
                            return [2 /*return*/];
                        }
                        if (content.length > 280) {
                            res.status(400).json({ error: 'O tweet não pode ter mais de 280 caracteres' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.tweet.create({
                                data: {
                                    content: content.trim(),
                                    authorId: authorId
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            username: true,
                                            profileImage: true
                                        }
                                    },
                                    _count: {
                                        select: {
                                            likes: true,
                                            replies: true
                                        }
                                    }
                                }
                            })];
                    case 1:
                        tweet = _a.sent();
                        res.status(201).json({
                            message: 'Tweet criado com sucesso',
                            tweet: tweet
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Erro ao criar tweet:', error_1);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Criar um tweet de reply
    TweetController.createReply = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var content, parentId, authorId, parentTweet, reply, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        content = req.body.content;
                        parentId = req.params.id;
                        authorId = req.userId;
                        // Validações básicas
                        if (!content || content.trim().length === 0) {
                            res.status(400).json({ error: 'O conteúdo da resposta é obrigatório' });
                            return [2 /*return*/];
                        }
                        if (content.length > 280) {
                            res.status(400).json({ error: 'A resposta não pode ter mais de 280 caracteres' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.tweet.findUnique({
                                where: { id: parentId }
                            })];
                    case 1:
                        parentTweet = _a.sent();
                        if (!parentTweet) {
                            res.status(404).json({ error: 'Tweet não encontrado' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.tweet.create({
                                data: {
                                    content: content.trim(),
                                    authorId: authorId,
                                    parentId: parentId
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            username: true,
                                            profileImage: true
                                        }
                                    },
                                    parent: {
                                        select: {
                                            id: true,
                                            content: true,
                                            author: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    username: true,
                                                    profileImage: true
                                                }
                                            }
                                        }
                                    },
                                    _count: {
                                        select: {
                                            likes: true,
                                            replies: true
                                        }
                                    }
                                }
                            })];
                    case 2:
                        reply = _a.sent();
                        res.status(201).json({
                            message: 'Resposta criada com sucesso',
                            reply: reply
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Erro ao criar resposta:', error_2);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Obter feed do usuário
    TweetController.getFeed = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId_1, page, limit, skip, following, followingIds, tweets, tweetsWithLikeInfo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId_1 = req.userId;
                        page = parseInt(req.query.page) || 1;
                        limit = parseInt(req.query.limit) || 20;
                        skip = (page - 1) * limit;
                        return [4 /*yield*/, prisma_1.prisma.follow.findMany({
                                where: { followerId: userId_1 },
                                select: { followingId: true }
                            })];
                    case 1:
                        following = _a.sent();
                        followingIds = following.map(function (f) { return f.followingId; });
                        followingIds.push(userId_1); // Incluir tweets do próprio usuário
                        return [4 /*yield*/, prisma_1.prisma.tweet.findMany({
                                where: {
                                    authorId: { in: followingIds },
                                    parentId: null // Apenas tweets principais, não replies
                                },
                                include: {
                                    author: {
                                        select: {
                                            id: true,
                                            name: true,
                                            username: true,
                                            profileImage: true
                                        }
                                    },
                                    likes: {
                                        select: {
                                            id: true,
                                            userId: true
                                        }
                                    },
                                    replies: {
                                        select: {
                                            id: true,
                                            content: true,
                                            createdAt: true,
                                            author: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    username: true,
                                                    profileImage: true
                                                }
                                            }
                                        },
                                        take: 3, // Mostrar apenas as 3 primeiras respostas
                                        orderBy: {
                                            createdAt: 'asc'
                                        }
                                    },
                                    _count: {
                                        select: {
                                            likes: true,
                                            replies: true
                                        }
                                    }
                                },
                                orderBy: {
                                    createdAt: 'desc'
                                },
                                skip: skip,
                                take: limit
                            })];
                    case 2:
                        tweets = _a.sent();
                        tweetsWithLikeInfo = tweets.map(function (tweet) { return (__assign(__assign({}, tweet), { isLikedByUser: tweet.likes.some(function (like) { return like.userId === userId_1; }), likes: tweet.likes.length })); });
                        res.json({
                            tweets: tweetsWithLikeInfo,
                            pagination: {
                                page: page,
                                limit: limit,
                                hasMore: tweets.length === limit
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Erro ao buscar feed:', error_3);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Curtir um tweet
    TweetController.likeTweet = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tweetId, userId, tweet, existingLike, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        tweetId = req.params.id;
                        userId = req.userId;
                        return [4 /*yield*/, prisma_1.prisma.tweet.findUnique({
                                where: { id: tweetId }
                            })];
                    case 1:
                        tweet = _a.sent();
                        if (!tweet) {
                            res.status(404).json({ error: 'Tweet não encontrado' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.prisma.like.findUnique({
                                where: {
                                    userId_tweetId: {
                                        userId: userId,
                                        tweetId: tweetId
                                    }
                                }
                            })];
                    case 2:
                        existingLike = _a.sent();
                        if (existingLike) {
                            res.status(409).json({ error: 'Você já curtiu este tweet' });
                            return [2 /*return*/];
                        }
                        // Criar o like
                        return [4 /*yield*/, prisma_1.prisma.like.create({
                                data: {
                                    userId: userId,
                                    tweetId: tweetId
                                }
                            })];
                    case 3:
                        // Criar o like
                        _a.sent();
                        res.status(201).json({ message: 'Tweet curtido com sucesso' });
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Erro ao curtir tweet:', error_4);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Remover like de um tweet
    TweetController.unlikeTweet = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tweetId, userId, existingLike, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        tweetId = req.params.id;
                        userId = req.userId;
                        return [4 /*yield*/, prisma_1.prisma.like.findUnique({
                                where: {
                                    userId_tweetId: {
                                        userId: userId,
                                        tweetId: tweetId
                                    }
                                }
                            })];
                    case 1:
                        existingLike = _a.sent();
                        if (!existingLike) {
                            res.status(404).json({ error: 'Você não curtiu este tweet' });
                            return [2 /*return*/];
                        }
                        // Remover o like
                        return [4 /*yield*/, prisma_1.prisma.like.delete({
                                where: {
                                    userId_tweetId: {
                                        userId: userId,
                                        tweetId: tweetId
                                    }
                                }
                            })];
                    case 2:
                        // Remover o like
                        _a.sent();
                        res.json({ message: 'Like removido com sucesso' });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Erro ao remover like:', error_5);
                        res.status(500).json({ error: 'Erro interno do servidor' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TweetController;
}());
exports.TweetController = TweetController;
