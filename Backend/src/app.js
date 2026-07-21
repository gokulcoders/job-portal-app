import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './modules/auth/auth.routes.js'
import jobsRoutes from './modules/jobs/jobs.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import walkinRoutes from './modules/walkin/walkin.routes.js'
import internshipRoutes from './modules/internship/internship.routes.js'
import featuredPostsRoutes from './modules/featuredPosts/featuredPosts.routes.js'
import notificationsRoutes from './modules/notifications/notifications.routes.js'
import coursesRoutes from './modules/courses/courses.routes.js'
import companiesRoutes from './modules/companies/companies.routes.js'
import settingsRoutes from './modules/settings/settings.routes.js'
import tenantsRoutes from './modules/tenants/tenants.routes.js'
import billingRoutes from './modules/billing/billing.routes.js'
import analyticsRoutes from './modules/analytics/analytics.routes.js'
import systemRoutes from './modules/system/system.routes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/walkin-jobs', walkinRoutes)
app.use('/api/internship-jobs', internshipRoutes)
app.use('/api/featured-posts', featuredPostsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/companies', companiesRoutes)
app.use('/api/admin/settings', settingsRoutes)
app.use('/api/admin/tenants', tenantsRoutes)
app.use('/api/admin/billing', billingRoutes)
app.use('/api/admin/analytics', analyticsRoutes)
app.use('/api/admin/system', systemRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
