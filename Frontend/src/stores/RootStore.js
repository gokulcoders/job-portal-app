import AuthStore from './AuthStore'
import UserStore from './UserStore'
import ProductStore from './ProductStore'
import ThemeStore from './ThemeStore'

// RootStore -> single instance that wires up every feature store
class RootStore {
  constructor() {
    this.authStore    = new AuthStore()
    this.userStore    = new UserStore()
    this.productStore = new ProductStore()
    this.themeStore   = new ThemeStore()
  }
}

export default RootStore
