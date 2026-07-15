import { makeAutoObservable, runInAction } from 'mobx'
import axiosInstance from '@api/axiosInstance'
import { ENDPOINTS } from '@api/endpoints'

// ProductStore -> list/detail state for products feature
class ProductStore {
  items = []
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchAll() {
    this.loading = true
    try {
      const { data } = await axiosInstance.get(ENDPOINTS.PRODUCTS)
      runInAction(() => { this.items = data })
    } finally {
      runInAction(() => { this.loading = false })
    }
  }
}

export default ProductStore
