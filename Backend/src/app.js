import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './modules/auth/auth.routes.js'
import jobsRoutes from './modules/jobs/jobs.routes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/api/jobs', jobsRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
