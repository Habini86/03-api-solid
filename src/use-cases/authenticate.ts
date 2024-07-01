import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCrendentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {
    /* ... */
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCrendentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCrendentialsError()
    }

    return {
      user,
    }
  }
}
