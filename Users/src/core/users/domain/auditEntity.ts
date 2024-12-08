export class RegistroAuditoria {
    constructor(
        public id_auditoria: string,
        public id_usuario: string,
        public accion: 'CREAR' | 'ACTUALIZAR' | 'BORRAR' | 'LOGIN' | 'LOGOUT' | 'ACTUALIZAR_ESTADO_VERIFICACION' | 'CREAR_HISTORIAL' | 'CONSULTAR',
        public entidad_afectada: 'usuarios' | 'hijos' | 'docentes' | 'medicamentos' | 'citas_medicas' | 'alimentos' | 'actividades' | 'hilos_chat' | 'mensajes_chat',
        public id_entidad: string,
        public fecha_accion: Date = new Date(),
        public descripcion: string
    ) {}
}
