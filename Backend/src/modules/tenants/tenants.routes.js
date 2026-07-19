import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import * as tenantsController from './tenants.controller.js'

const router = Router()

router.use(requireAuth, requireRole('super_admin'))
router.get('/', tenantsController.list)
router.post('/', tenantsController.create)
router.patch('/:id', tenantsController.update)
router.delete('/:id', tenantsController.remove)

export default router
