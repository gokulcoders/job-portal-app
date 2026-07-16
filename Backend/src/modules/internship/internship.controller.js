import { listInternshipJobs } from './internship.service.js'

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

export const list = asyncHandler(async (req, res) => {
  const { page, limit, q, keyword, company, place, source } = req.query
  const result = await listInternshipJobs({ page, limit, q, keyword, company, place, source })
  res.json(result)
})
