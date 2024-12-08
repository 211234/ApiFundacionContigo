export interface AuditLogDTO {
    id_auditoria: string;
    id_usuario: string;
    accion: 'CREAR' | 'ACTUALIZAR' | 'BORRAR' | 'LOGIN' | 'LOGOUT' | 'ACTUALIZAR_ESTADO_VERIFICACION' | 'CREAR_HISTORIAL' | 'CONSULTAR';
    entidad_afectada: 'usuarios' | 'hijos' | 'docentes' | 'medicamentos' | 'citas_medicas' | 'alimentos' | 'actividades' | 'hilos_chat' | 'mensajes_chat';
    id_entidad: string;
    descripcion: string;
    fecha_accion: Date;
}
