// database.ts
import mongoose from 'mongoose';
import { env } from './env';

class Database {
    private uri: string;
    private options: mongoose.ConnectOptions;

    constructor() {
        // Asignar la URI de conexión desde el archivo env.ts
        this.uri = env.db.host || 'mongodb://localhost:27017/notifications_db';

        // Opciones de conexión para evitar advertencias de deprecación
        this.options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
    }

    /**
     * Conectar a la base de datos MongoDB con reintentos en caso de fallos.
     */
    public async connect(): Promise<void> {
        let retries = 5; // Número de intentos de reconexión
        while (retries) {
            try {
                await mongoose.connect(this.uri, this.options);
                console.log('MongoDB connected ✅');
                break; // Si la conexión es exitosa, salir del bucle
            } catch (error) {
                retries -= 1;
                console.error(`MongoDB connection error ❌, retries left: ${retries}`, error);
                if (retries === 0) {
                    console.error('All retries failed. Exiting...');
                    process.exit(1); // Salir del proceso si todos los intentos fallan
                }
                // Esperar 5 segundos antes de intentar reconectar
                await new Promise((res) => setTimeout(res, 5000));
            }
        }
    }

    /**
     * Desconectar de la base de datos MongoDB.
     */
    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
        }
    }
}

// Exportar una instancia única para su uso en toda la aplicación
export const database = new Database();
