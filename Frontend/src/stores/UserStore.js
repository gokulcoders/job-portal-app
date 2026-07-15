import { makeAutoObservable, runInAction } from 'mobx'
import axiosInstance from '@api/axiosInstance'
import { ENDPOINTS } from '@api/endpoints'

// UserStore -> profile data, settings
class UserStore {
  profile = null
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchProfile() {
    this.loading = true
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.PROFILE)
      runInAction(() => { this.profile = data })
    } finally {
      runInAction(() => { this.loading = false })
    }
  }
}

export default UserStore
