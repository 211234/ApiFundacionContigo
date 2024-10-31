import { HijoRepositoryPort } from '../ports/hijoRepositoryPort';
import { Hijo } from '../../../core/users/domain/hijoEntity';
import { UpdateHijoDTO } from '../../../adapters/in/users/dtos/updateHijoDto';


export class UpdateHijoUseCase {
    constructor(private readonly hijoRepository: HijoRepositoryPort) { }

    async execute(id_hijo: string, updatedData: Partial<Hijo>): Promise<Hijo | null> {
        const existingHijo = await this.hijoRepository.findById(id_hijo);
        if (!existingHijo) {
            throw new Error('Niño no encontrado');
        }

        return this.hijoRepository.update(id_hijo, updatedData);
    }
}
