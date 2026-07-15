import { Router } from 'express'
import * as jobsController from './jobs.controller.js'

const router = Router()

router.get('/', jobsController.listJobs)
router.get('/latest', jobsController.latestJobs)
router.get('/search', jobsController.searchJobs)
router.get('/:id', jobsController.getJobById)
router.delete('/:id', jobsController.deleteJob)

export default router
