import axios from 'axios';

export class TokenService {
    private readonly notificationApiUrl = process.env.NOTIFICATION_API_URL;

    async validateConfirmationToken(correo: string, codigo: string) {
        try {
            const response = await axios.post(`${this.notificationApiUrl}/v1/token/validate`, {
                correo,
                codigo
            });
            console.log('Respuesta de validación del token:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al validar el token de confirmación:', error);
            return null;
        }
    }

}
