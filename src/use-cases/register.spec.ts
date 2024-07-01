import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let sut: RegisterUseCase
let usersRepository: InMemoryUsersRepository

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const password = '123456'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should be able to hash the user's password during the registration process", async () => {
    const password = '123456'

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password,
    })

    const isPasswordCorrectHash = await compare(password, user.password_hash)

    expect(isPasswordCorrectHash).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const password = '123456'

    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password,
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
