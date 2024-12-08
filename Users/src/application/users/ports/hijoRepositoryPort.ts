import { UpdateHijoDTO } from '../../../adapters/in/users/dtos/updateHijoDto';
import { Hijo } from '../../../core/users/domain/hijoEntity';

export interface HijoRepositoryPort {
    createHijo(hijo: Hijo): Promise<Hijo>;
    findById(id_hijo: string): Promise<Hijo | null>;
    update(id_niño: string, updatedData: UpdateHijoDTO): Promise<Hijo | null>;
}
