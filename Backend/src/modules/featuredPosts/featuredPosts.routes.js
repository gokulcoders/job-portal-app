import { Router } from 'express'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'
import { upload } from '../../middleware/upload.js'
import * as featuredPostsController from './featuredPosts.controller.js'

const router = Router()

// Public — ?page=jobs|urgent|internship|walkin filters to one opportunities page
router.get('/', featuredPostsController.listPublic)

// Admin management — super_admin only
router.get('/admin', requireAuth, requireRole('super_admin'), featuredPostsController.listAll)
router.post('/admin', requireAuth, requireRole('super_admin'), upload.single('image'), featuredPostsController.create)
router.post('/admin/preview-link', requireAuth, requireRole('super_admin'), featuredPostsController.previewLink)
router.delete('/admin/:id', requireAuth, requireRole('super_admin'), featuredPostsController.remove)

export default router
