import { Request, Response, NextFunction } from 'express';
import { UpdateEstadoActividadUseCase } from '../../../../application/actividades/use-case/updateEstadoActividadUseCase';

export class UpdateEstadoActividadController {
    constructor(private readonly updateEstadoActividadUseCase: UpdateEstadoActividadUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_estado } = req.params;
            const { evidencia_url, fecha_completado, tiempo_minutos } = req.body;
            if (!evidencia_url || !fecha_completado || tiempo_minutos === undefined) {
                res.status(400).send('Datos faltantes para actualizar el estado.');
            }
            const fechaCompletadoDate = new Date(fecha_completado);
            if (isNaN(fechaCompletadoDate.getTime())) {
                throw new Error('La fecha proporcionada no es válida.');
            }
            const minutos = parseInt(tiempo_minutos, 10);
            if (isNaN(minutos) || minutos < 0) {
                res.status(400).send('El tiempo_minutos debe ser un número positivo.');
            }
            await this.updateEstadoActividadUseCase.execute(id_estado, {
                evidencia_url,
                fecha_completado: fechaCompletadoDate,
                tiempo_minutos: minutos,
            });
            res.status(200).send('Estado de actividad actualizado correctamente.');
        } catch (error) {
            console.error('Error en el controlador:', error);
            next(error);
        }
    }
}
