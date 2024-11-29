import cloudinary from '../../../infrastructure/config/cloudinary';
import fs from 'fs/promises';

// Configuración
const MAX_FILE_SIZE_MB = 5; // Tamaño máximo en MB
const transformation = [
    { width: 800, height: 600, crop: 'limit' },  // Limitar el tamaño a 800x600
    { quality: 'auto', fetch_format: 'auto' }   // Comprimir automáticamente
];

export const uploadImage = async (filePath: string): Promise<string> => {
    try {
        // Obtener el tamaño del archivo
        const stats = await fs.stat(filePath);
        const fileSizeMB = stats.size / (1024 * 1024); // Convertir a MB

        // Determinar si aplicar transformaciones
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'actividades',
            use_filename: true,
            unique_filename: false,
            transformation: fileSizeMB > MAX_FILE_SIZE_MB ? transformation : undefined, // Solo si supera el límite
        });

        // Eliminar el archivo local después de subirlo
        await fs.unlink(filePath);

        // Devolver la URL segura de Cloudinary
        return result.secure_url;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw new Error('Error al subir imagen a Cloudinary');
    }
};
