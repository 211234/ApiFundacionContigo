import { EstadoActividadesRepositoryPort } from '../ports/estadoActividadesRepositoryPort';

export class GetActividadesByUsuarioUseCase {
    constructor(private readonly estadoActividadesRepository: EstadoActividadesRepositoryPort) { }

    async execute(id_usuario: string): Promise<any[]> {
        return await this.estadoActividadesRepository.getActividadesByUsuario(id_usuario);
    }
}
