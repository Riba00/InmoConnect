import multer from "multer";
import path from "path";
import fs from 'fs';
import { generateId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "..", "public", "uploads"); // Construir ruta absoluta

    // Comprobar si el directorio existe de forma síncrona para mejor rendimiento
    if (!fs.existsSync(uploadsDir)) {
      // Crear el directorio si no existe con la opción recursiva
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, generateId() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
