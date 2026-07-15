import { createContext } from 'react'
import RootStore from './RootStore'

// One root store instance shared across the whole app
export const StoreContext = createContext(new RootStore())
export const StoreProvider = StoreContext.Provider
