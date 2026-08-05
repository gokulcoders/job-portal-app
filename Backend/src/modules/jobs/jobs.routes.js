import { Router } from 'express'
import * as jobsController from './jobs.controller.js'
import { requireAuth, requireRole } from '../../middleware/authMiddleware.js'

const router = Router()

router.get('/', jobsController.listJobs)
router.get('/latest', jobsController.latestJobs)
router.get('/search', jobsController.searchJobs)
router.get('/admin/scraper/stats', requireAuth, requireRole('admin'), jobsController.getScraperStats)
router.delete('/admin/scraper/clear', requireAuth, requireRole('admin'), jobsController.clearScraperData)
router.post('/admin/scraper/run', requireAuth, requireRole('admin'), jobsController.triggerScraper)

router.get('/:id', jobsController.getJobById)
router.delete('/:id', requireAuth, requireRole('admin'), jobsController.deleteJob)

export default router
