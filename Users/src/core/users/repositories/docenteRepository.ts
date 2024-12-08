import { Docente } from '../../../core/users/domain/docenteEntity';
import { UpdateDocenteDTO } from '../../../adapters/in/users/dtos/updateDocenteDto';
import { DocenteRepositoryImpl as DocenteRepositoryPort } from './docenteRepository';

export class DocenteRepositoryImpl implements DocenteRepositoryPort {
    private docenteRepo: any;

    async findById(id_docente: string): Promise<Docente | null> {
        return await this.docenteRepo.findOne({ where: { id_docente } });
    }

    async update(id_docente: string, updatedData: UpdateDocenteDTO): Promise<Docente | null> {
        await this.docenteRepo.update(id_docente, updatedData);
        const updatedDocente = await this.docenteRepo.findOne(id_docente);
        if (!updatedDocente) {
            throw new Error('Docente no encontrado');
        }
        return updatedDocente;
    }

    async delete(id_docente: string): Promise<void> {
        await this.docenteRepo.delete(id_docente);
    }

    async getAllDocentes(): Promise<Docente[]> {
        return await this.docenteRepo.find();
    }
}
