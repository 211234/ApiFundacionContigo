import bcrypt from 'bcrypt';
import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { DocenteRepositoryPort } from '../ports/docenteRepositoryPort';
import { RegisterDocenteDTO } from '../../../adapters/in/users/dtos/registerDocenteDto';
import { Docente } from '../../../core/users/domain/docenteEntity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../core/users/domain/userEntity';
import { AuditService } from '../../../core/users/services/auditService';

export class RegisterDocenteUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly docenteRepository: DocenteRepositoryPort,
        private readonly auditService: AuditService // Añade el servicio de auditoría
    ) {}

    async execute(docenteDTO: RegisterDocenteDTO): Promise<Docente> {
        // Verifica si el usuario es administrador
        const adminUser = await this.userRepository.findById(docenteDTO.id_usuario);
        if (!adminUser || adminUser.tipo !== 'Administrador') {
            throw new Error('Solo el Administrador puede registrar un docente');
        }

        // Hashea la contraseña
        const hashedPassword = await bcrypt.hash(docenteDTO.password, 10);

        // Registra el usuario en `usuarios`
        const nuevoUsuarioId = uuidv4();
        const nuevoUsuario: User = {
            id_usuario: nuevoUsuarioId,
            nombre: docenteDTO.nombre,
            correo: docenteDTO.correo,
            password: hashedPassword,
            telefono: docenteDTO.telefono,
            tipo: 'Docente',
            fecha_registro: new Date()
        };

        await this.userRepository.createUser(nuevoUsuario);

        // Registra el docente en `docentes`
        const docente = new Docente(uuidv4(), nuevoUsuarioId, docenteDTO.materia, docenteDTO.direccion);
        const docenteCreado = await this.docenteRepository.createDocente(docente);

        // Registra la acción en la auditoría
        await this.auditService.createAuditLog({
            id_usuario: docenteDTO.id_usuario,
            accion: 'CREAR',
            entidad_afectada: 'docentes',
            id_entidad: docenteCreado.id_docente,
        });

        return docenteCreado;
    }
}
