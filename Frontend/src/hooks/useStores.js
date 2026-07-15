import { useContext } from 'react'
import { StoreContext } from '@stores/StoreContext'

// Usage: const { authStore } = useStores()
export const useStores = () => useContext(StoreContext)
