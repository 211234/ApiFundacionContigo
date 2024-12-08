import { HijoRepositoryPort } from '../ports/hijoRepositoryPort';
import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { RegisterHijoDTO } from '../../../adapters/in/users/dtos/registerHijoDto';
import { Hijo } from '../../../core/users/domain/hijoEntity';
import { v4 as uuidv4 } from 'uuid';
import { AuditService } from '../../../core/users/services/auditService';

export class RegisterHijoUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly hijoRepository: HijoRepositoryPort,
        private readonly auditService: AuditService // Inyectamos el servicio de auditoría
    ) {}

    async execute(hijoDTO: RegisterHijoDTO): Promise<Hijo> {
        // Verificación de que el usuario sea un padre
        const padre = await this.userRepository.findById(hijoDTO.id_padre);
        if (!padre || padre.tipo !== 'Padre') {
            throw new Error('Solo un padre puede registrar un niño.');
        }

        // Creación de la entidad Hijo con la información del DTO
        const hijo = new Hijo(
            uuidv4(),
            hijoDTO.id_padre,
            hijoDTO.nombre,
            hijoDTO.fecha_nacimiento,
            hijoDTO.direccion
        );

        // Guardar el hijo en la base de datos
        const createdHijo = await this.hijoRepository.createHijo(hijo);

        // Registro de auditoría después de la creación del hijo
        await this.auditService.createAuditLog({
            id_usuario: padre.id_usuario,           // ID del padre que realiza la acción
            accion: 'CREAR',
            entidad_afectada: 'hijos',              // Entidad afectada
            id_entidad: createdHijo.id_hijo         // ID del hijo creado
        });

        return createdHijo;  // Devolver el hijo creado
    }
}
