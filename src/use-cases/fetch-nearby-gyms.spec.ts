import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let sut: FetchNearbyGymsUseCase
let gymsRepository: InMemoryGymsRepository

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -7.2047973,
      longitude: -48.2095057,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: 10.3448165,
      longitude: -48.8925816,
    })

    const { gyms } = await sut.execute({
      userLatitude: -7.2047973,
      userLongitude: -48.2095057,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
