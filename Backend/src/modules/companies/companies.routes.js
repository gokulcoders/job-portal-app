import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import { uploadCompanyLogo } from '../../middleware/upload.js'
import { uploadDataFile } from '../../middleware/uploadFile.js'
import * as companiesController from './companies.controller.js'

const router = Router()

// Public — browsable company directory
router.get('/', companiesController.listPublic)

// Admin management — super_admin only
router.get('/admin', requireAuth, requireRole('super_admin'), companiesController.listAllAdmin)
router.post('/admin', requireAuth, requireRole('super_admin'), uploadCompanyLogo.single('logo'), companiesController.create)
router.post('/admin/import', requireAuth, requireRole('super_admin'), uploadDataFile.single('file'), companiesController.bulkImport)
router.patch('/admin/:id', requireAuth, requireRole('super_admin'), uploadCompanyLogo.single('logo'), companiesController.update)
router.delete('/admin/:id', requireAuth, requireRole('super_admin'), companiesController.remove)

export default router
