import { Niño } from '../../../core/users/domain/niñoEntity';

export interface NiñoRepositoryPort {
    createNiño(niño: Niño): Promise<Niño>;
}
