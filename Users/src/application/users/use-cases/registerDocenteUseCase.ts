import bcrypt from 'bcrypt';
import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { DocenteRepositoryPort } from '../ports/docenteRepositoryPort';
import { RegisterDocenteDTO } from '../../../adapters/in/users/dtos/registerDocenteDto';
import { Docente } from '../../../core/users/domain/docenteEntity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../core/users/domain/userEntity';

export class RegisterDocenteUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly docenteRepository: DocenteRepositoryPort
    ) {}

    async execute(docenteDTO: RegisterDocenteDTO): Promise<Docente> {
        // 1. Verifica si el usuario es administrador
        const adminUser = await this.userRepository.findById(docenteDTO.id_usuario);
        if (!adminUser || adminUser.tipo !== 'Administrador') {
            throw new Error('Solo el Administrador puede registrar un docente');
        }

        // 2. Hashea la contraseña
        const hashedPassword = await bcrypt.hash(docenteDTO.password, 10);

        // 3. Registra el usuario en `usuarios`
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

        // 4. Crea el objeto `Docente` y lo guarda en `docentes`
        const docente = new Docente(uuidv4(), nuevoUsuarioId, docenteDTO.materia, docenteDTO.direccion);
        return await this.docenteRepository.createDocente(docente);
    }
}
