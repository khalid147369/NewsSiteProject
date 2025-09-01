import cron from "node-cron";
import axios from "axios";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { IPost } from "../types";
import PostModel from '../models/post'; // Import the Mongoose User model


dotenv.config();

// MongoDB setup

const coleccion = PostModel;
const MaxPosts:number =JSON.parse(process.env.MAX_POSTS || '200');
// Categorías que deseas obtener
const categorias = ["sports", "politics", "technology", "world"];
// delete category posts over to 200
async function deleteOldPosts(category: string) {
  const count = await coleccion.countDocuments({ category });

    if (count > MaxPosts ) {
    const toDelete = count - MaxPosts;
    const toDeletePosts =await coleccion.find({ category })
      .sort({ publishedAt: 1 }) // más antiguas primero
      .limit(toDelete)
      .select("_id");
      const ids = toDeletePosts.map(post => post._id);

await coleccion.deleteMany({ _id: { $in: ids } });
  }
}

async function obtenerNoticias(categoria: string): Promise<IPost[]> {
  try {
    const response = await axios.get(process.env.NOTICE_PROVIDER_ROUTE ||"", {
      params: {
        topic: categoria,
        lang: "en",
        token: process.env.GNEWS_API_KEY
      }
    });
    return response.data.articles as IPost[];
  } catch (error) {
    console.error(`❌ Error al obtener noticias de ${categoria}:`, (error as Error).message);
    return [];
  }
}

async function guardarNoticias(articulos: IPost[], categoria: string) {
  for (const articulo of articulos) {
    const noticia: IPost = {
      title: articulo.title,
      content: articulo.content || "",
      category: categoria,
      description: articulo.description || "",
      publishedAt: articulo.publishedAt ? new Date(articulo.publishedAt) : new Date(),
      image: articulo.image || "",
      source:{
        url: articulo.source.url,
        name: articulo.source.name
      } 
    };

    const existe = await coleccion.findOne({ title: noticia.title });
    if (!existe) {
      await coleccion.insertOne(noticia);
      console.log("✅ Guardado:", noticia.title);
    } else {
      console.log("🔁 Ya existe:", noticia.title);
    }
  
  }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

cron.schedule("0 * * * *", async () => {
  console.log("⏱️ Ejecutando importación de noticias...");

  for (const categoria of categorias) {
    const articulos = await obtenerNoticias(categoria);
    await guardarNoticias(articulos, categoria);
    await delay(1500); // Espera 1.5 segundos entre cada categoría
    await deleteOldPosts(categoria);
  }
});
