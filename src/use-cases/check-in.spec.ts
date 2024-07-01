import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-erro'

let sut: CheckInUseCase
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
function dateFake() {
  vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
}

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-7.2047973),
      longitude: new Decimal(-48.2095057),
      created_at: new Date(),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    dateFake()

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -7.2047973,
      userLongitude: -48.2095057,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    dateFake()

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -7.2047973,
      userLongitude: -48.2095057,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -7.2047973,
        userLongitude: -48.2095057,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    dateFake()

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -7.2047973,
      userLongitude: -48.2095057,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -7.2047973,
      userLongitude: -48.2095057,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-7.7692611),
      longitude: new Decimal(-48.4312623),
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -7.2047973,
        userLongitude: -48.2095057,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
