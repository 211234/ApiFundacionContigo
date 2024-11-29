import { ActividadesRepositoryPort } from '../ports/actividadesRepositoryPort';

export class GetActividadesByDocenteUseCase {
    constructor(private readonly actividadesRepository: ActividadesRepositoryPort) {}

    async execute(id_docente: string): Promise<any[]> {
        return await this.actividadesRepository.getActividadesByDocente(id_docente);
    }
}
