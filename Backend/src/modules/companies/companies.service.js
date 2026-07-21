import Company from '../../models/Company.js'
import Job from '../../models/Job.js'
import { ApiError } from '../../utils/ApiError.js'
import cloudinary from '../../config/cloudinary.js'

const CASE_INSENSITIVE = { locale: 'en', strength: 2 }

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function destroyLogo(publicId) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error(`Failed to delete Cloudinary logo ${publicId}:`, err.message)
  }
}

// Job.company is free-text (scraped), so open-role counts are matched case-insensitively
// against each company's name rather than stored — always reflects live job data.
async function withOpenRoleCounts(companies) {
  const counts = await Job.aggregate([
    { $match: { company: { $nin: ['', null] } } },
    { $group: { _id: { $toLower: '$company' }, count: { $sum: 1 } } },
  ])
  const countMap = new Map(counts.map(c => [c._id, c.count]))
  return companies.map(c => ({ ...c, openRoles: countMap.get(c.name.toLowerCase()) || 0 }))
}

export async function listActiveCompanies({ industry, remoteOnly, q } = {}) {
  const filter = { isActive: true }
  if (industry && industry !== 'All') filter.industry = new RegExp(`^${escapeRegex(industry)}$`, 'i')
  if (remoteOnly === 'true' || remoteOnly === true) filter.remoteFriendly = true
  if (q) {
    const re = new RegExp(escapeRegex(q.trim()), 'i')
    filter.$or = [{ name: re }, { location: re }]
  }

  const companies = await Company.find(filter).sort({ name: 1 }).lean()
  return withOpenRoleCounts(companies)
}

export async function listAllCompanies() {
  const companies = await Company.find().sort({ name: 1 }).lean()
  return withOpenRoleCounts(companies)
}

async function assertNameAvailable(name, excludeId) {
  const query = Company.findOne({ name }).collation(CASE_INSENSITIVE)
  if (excludeId) query.where('_id').ne(excludeId)
  const existing = await query.lean()
  if (existing) throw new ApiError(409, 'A company with this name already exists')
}

export async function createCompany(data) {
  await assertNameAvailable(data.name)
  return Company.create(data)
}

export async function updateCompany(id, data) {
  const company = await Company.findById(id)
  if (!company) throw new ApiError(404, 'Company not found')

  if (data.name && data.name.toLowerCase() !== company.name.toLowerCase()) {
    await assertNameAvailable(data.name, id)
  }

  const oldLogoPublicId = company.logoPublicId
  Object.assign(company, data)
  await company.save()

  if (data.logoPublicId && oldLogoPublicId && oldLogoPublicId !== data.logoPublicId) {
    await destroyLogo(oldLogoPublicId)
  }
  return company
}

export async function deleteCompany(id) {
  const company = await Company.findByIdAndDelete(id)
  if (!company) throw new ApiError(404, 'Company not found')
  await destroyLogo(company.logoPublicId)
  return { deleted: true }
}

// Bulk import: rows already parsed from the uploaded file (see company.parser.js) and
// held only in memory. Matches "skip duplicates" — a row whose name already exists
// (case-insensitively, including duplicates within the same file) is left untouched.
export async function bulkImportCompanies(rows, createdBy) {
  const existing = await Company.find().select('name').lean()
  const seenNames = new Set(existing.map(c => c.name.toLowerCase()))

  let inserted = 0
  let skipped = 0
  const errors = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const name = row.name?.trim()
    if (!name) continue

    const lowerName = name.toLowerCase()
    if (seenNames.has(lowerName)) {
      skipped++
      continue
    }

    try {
      await Company.create({
        name,
        industry: row.industry || '',
        location: row.location || '',
        size: row.size || '',
        description: row.description || '',
        website: row.website || '',
        logo: row.logo || '',
        remoteFriendly: !!row.remoteFriendly,
        createdBy,
      })
      seenNames.add(lowerName)
      inserted++
    } catch (err) {
      if (err.code === 11000) {
        skipped++
      } else {
        errors.push({ row: i + 1, name, message: err.message })
      }
    }
  }

  return { inserted, skipped, errors }
}
