import InternshipJob from '../../models/InternshipJob.js'

function buildFilter({ q, keyword, company, place, source }) {
  const filter = {}
  if (keyword) filter.keyword = { $regex: new RegExp(keyword, 'i') }
  if (company) filter.company = { $regex: new RegExp(company, 'i') }
  if (place)   filter.place   = { $regex: new RegExp(place,   'i') }
  if (source)  filter.source  = { $regex: new RegExp(source,  'i') }
  if (q) {
    const re = new RegExp(q, 'i')
    filter.$or = [{ title: re }, { company: re }, { place: re }, { keyword: re }]
  }
  return filter
}

export async function listInternshipJobs({ q, keyword, company, place, source, page = 1, limit = 20 }) {
  const filter   = buildFilter({ q, keyword, company, place, source })
  const pageNum  = Math.max(1, Number(page)  || 1)
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20))

  const [jobs, total] = await Promise.all([
    InternshipJob.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
    InternshipJob.countDocuments(filter),
  ])

  return { jobs, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
}

export async function upsertInternshipJob(data) {
  return InternshipJob.findOneAndUpdate(
    { jobLink: data.jobLink },
    { $set: data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

export async function cleanupOldInternshipJobs(hoursOld = 24) {
  const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000)
  const result = await InternshipJob.deleteMany({ updatedAt: { $lt: cutoff } })
  return result.deletedCount
}
