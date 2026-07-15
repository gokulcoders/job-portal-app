import Job from '../../models/Job.js'

function buildFilter({ q, keyword, company, place }) {
  const filter = {}

  if (keyword) {
    filter.keyword = { $regex: new RegExp(keyword, 'i') }
  }

  if (company) {
    filter.company = { $regex: new RegExp(company, 'i') }
  }

  if (place) {
    filter.place = { $regex: new RegExp(place, 'i') }
  }

  if (q) {
    const regex = new RegExp(q, 'i')
    filter.$or = [
      { title: regex },
      { company: regex },
      { place: regex },
      { keyword: regex },
    ]
  }

  return filter
}

export async function listJobs({ q, keyword, company, place, page = 1, limit = 20 }) {
  const filter = buildFilter({ q, keyword, company, place })
  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20))

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Job.countDocuments(filter),
  ])

  return {
    jobs,
    total,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil(total / limitNum),
  }
}

export async function getJobById(id) {
  return Job.findById(id).lean()
}

export async function searchJobs(q, query) {
  return listJobs({ ...query, q })
}

export async function latestJobs(limit = 10) {
  return Job.find()
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean()
}

export async function deleteJob(id) {
  return Job.findByIdAndDelete(id)
}

export async function upsertJob(data) {
  return Job.findOneAndUpdate(
    { jobLink: data.jobLink },
    { $set: data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}
