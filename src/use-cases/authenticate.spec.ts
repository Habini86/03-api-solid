import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCrendentialsError } from './errors/invalid-credentials-error'

let sut: AuthenticateUseCase
let usersRepository: InMemoryUsersRepository

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash(password, 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const password = '123456'

    await expect(() =>
      sut.execute({
        email: 'johndoe@email.com',
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCrendentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash(password, 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@email.com',
        password: '1231313',
      }),
    ).rejects.toBeInstanceOf(InvalidCrendentialsError)
  })
})
