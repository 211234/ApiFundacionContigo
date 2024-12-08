import { UserRepositoryPort } from '../../users/ports/userRepositoryPort';

export class GetPadresConHijosUseCase {
    constructor(private readonly usuariosRepository: UserRepositoryPort) { }

    async execute(): Promise<any[]> {
        return await this.usuariosRepository.getPadresConHijos();
    }
}
