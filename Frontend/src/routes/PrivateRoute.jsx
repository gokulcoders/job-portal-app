import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router-dom'
import { useStores } from '@hooks/useStores'

const PrivateRoute = observer(({ children }) => {
  const { authStore } = useStores()
  return authStore.isAuthenticated ? children : <Navigate to="/login" replace />
})

export default PrivateRoute
