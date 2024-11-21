import { AuditService } from '../../../core/users/services/auditService';
import { UserService } from '../../../core/users/services/servicesUser';

interface UserActionData {
    id_usuario: string;
    accion: 'CREAR' | 'ACTUALIZAR' | 'BORRAR' | 'LOGIN' | 'LOGOUT' | 'ACTUALIZAR_ESTADO_VERIFICACION';
    entidad_afectada: 'usuarios' | 'hijos' | 'docentes' | 'medicamentos' | 'citas_medicas' | 'alimentos' | 'actividades' | 'hilos_chat' | 'mensajes_chat';
    id_entidad: string;
}

export class UserAuditUseCase {
    [x: string]: any;
    constructor(
        private userService: UserService,
        private auditService: AuditService
    ) { }

    async createUser(data: any) {
        const user = await this.userService.registerUser(data);
        await this.auditService.createAuditLog({
            id_usuario: user.id_usuario,
            accion: 'CREAR',
            entidad_afectada: 'usuarios',
            id_entidad: user.id_usuario,
        });
        return user;
    }

    async updateUser(id_usuario: string, data: any) {
        const updatedUser = await this.userService.updateUser(id_usuario, data);
        await this.auditService.createAuditLog({
            id_usuario,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario,
        });
        return updatedUser;
    }

    async deleteUser(id_usuario: string) {
        await this.userService.deleteUser(id_usuario);
        await this.auditService.createAuditLog({
            id_usuario,
            accion: 'BORRAR',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario,
        });
    }

    async loginUser(id_usuario: string) {
        console.log("Attempting loginUser in UserAuditUseCase for user:", id_usuario);
        const user = await this.userService.loginUser(id_usuario);

        console.log("User logged in, attempting to create audit log...");
        await this.auditService.createAuditLog({
            id_usuario,
            accion: 'LOGIN',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario,
        });
        console.log("Audit log created successfully in loginUser");

        return user;
    }

    async logoutUser(id_usuario: string) {
        console.log("Attempting logoutUser in UserAuditUseCase for user:", id_usuario);
        await this.userService.logoutUser(id_usuario);

        console.log("User logged out, attempting to create audit log...");
        await this.auditService.createAuditLog({
            id_usuario,
            accion: 'LOGOUT',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario,
        });
        console.log("Audit log created successfully in logoutUser");
    }
}
