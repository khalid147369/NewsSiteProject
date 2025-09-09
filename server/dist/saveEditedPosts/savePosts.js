"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const post_1 = __importDefault(require("../models/post")); // Import the Mongoose User model
dotenv.config();
// MongoDB setup
const coleccion = post_1.default;
const MaxPosts = JSON.parse(process.env.MAX_POSTS || '200');
// Categorías que deseas obtener
const categorias = ["sports", "politics", "technology", "world"];
// delete category posts over to 200
function deleteOldPosts(category) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield coleccion.countDocuments({ category });
        if (count > MaxPosts) {
            const toDelete = count - MaxPosts;
            const toDeletePosts = yield coleccion.find({ category })
                .sort({ publishedAt: 1 }) // más antiguas primero
                .limit(toDelete)
                .select("_id");
            const ids = toDeletePosts.map(post => post._id);
            yield coleccion.deleteMany({ _id: { $in: ids } });
        }
    });
}
function obtenerNoticias(categoria) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(process.env.NOTICE_PROVIDER_ROUTE || "", {
                params: {
                    topic: categoria,
                    lang: "en",
                    token: process.env.GNEWS_API_KEY
                }
            });
            return response.data.articles;
        }
        catch (error) {
            console.error(`❌ Error al obtener noticias de ${categoria}:`, error.message);
            return [];
        }
    });
}
function guardarNoticias(articulos, categoria) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const articulo of articulos) {
            const noticia = {
                title: articulo.title,
                content: articulo.content || "",
                category: categoria,
                description: articulo.description || "",
                publishedAt: articulo.publishedAt ? new Date(articulo.publishedAt) : new Date(),
                image: articulo.image || "",
                source: {
                    url: articulo.source.url,
                    name: articulo.source.name
                }
            };
            const existe = yield coleccion.findOne({ title: noticia.title });
            if (!existe) {
                yield coleccion.insertOne(noticia);
                console.log("✅ Guardado:", noticia.title);
            }
            else {
                console.log("🔁 Ya existe:", noticia.title);
            }
        }
    });
}
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("⏱️ Ejecutando importación de noticias...");
    for (const categoria of categorias) {
        const articulos = yield obtenerNoticias(categoria);
        yield guardarNoticias(articulos, categoria);
        yield delay(1500); // Espera 1.5 segundos entre cada categoría
        yield deleteOldPosts(categoria);
    }
}));
