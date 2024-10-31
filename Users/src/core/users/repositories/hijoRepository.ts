import { Hijo } from '../domain/hijoEntity';
import { UpdateHijoDTO } from '../../../adapters/in/users/dtos/updateHijoDto';
import { HijoRepositoryImpl as HijoRepositoryPort } from './hijoRepository';

export class HijoRepositoryImpl implements HijoRepositoryPort {
    private hijoRepo: any;

    async findById(id_hijo: string): Promise<Hijo | null> {
        return await this.hijoRepo.findOne({ where: { id_hijo } });
    }

    async update(id_hijo: string, updatedData: UpdateHijoDTO): Promise<Hijo | null> {
        await this.hijoRepo.update(id_hijo, updatedData);
        const updatedHijo = await this.hijoRepo.findOne(id_hijo);
        if (!updatedHijo) {
            throw new Error('Niño no encontrado');
        }
        return updatedHijo;
    }
}
