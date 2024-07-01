import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let sut: ValidateCheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository

function dateFake() {
  vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
}

describe('Validate check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate to check-in', async () => {
    // dateFake()

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    // dateFake()

    expect(async () => {
      await sut.execute({
        checkInId: 'ineixstent-check-in-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    dateFake()

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
