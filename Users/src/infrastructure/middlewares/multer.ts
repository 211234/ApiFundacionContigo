import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ruta para la carpeta de uploads
const uploadDir = path.join(__dirname, '../../../uploads');

// Crear la carpeta `uploads` si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Lista de tipos MIME permitidos
const allowedMimeTypes = [
    'image/jpeg',      // JPEG
    'image/png',       // PNG
    'image/gif',       // GIF
    'image/bmp',       // BMP
    'image/webp',      // WebP
    'image/svg+xml',   // SVG
];

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Usa la carpeta `uploads`
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error(`Formato no permitido. Los formatos aceptados son: ${allowedMimeTypes.join(', ')}`));
        }
        cb(null, true);
    },
});

export default upload;
