import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js'
import * as companiesService from './companies.service.js'
import { parseCompanyFile } from './company.parser.js'

function pickCompanyFields(body) {
  const { name, industry, location, size, description, website, remoteFriendly } = body
  const data = {}
  if (name !== undefined) data.name = name.trim()
  if (industry !== undefined) data.industry = industry.trim()
  if (location !== undefined) data.location = location.trim()
  if (size !== undefined) data.size = size.trim()
  if (description !== undefined) data.description = description.trim()
  if (website !== undefined) data.website = website.trim()
  if (remoteFriendly !== undefined) data.remoteFriendly = remoteFriendly === true || remoteFriendly === 'true'
  return data
}

export const listPublic = asyncHandler(async (req, res) => {
  const companies = await companiesService.listActiveCompanies(req.query)
  res.json({ companies })
})

export const listAllAdmin = asyncHandler(async (req, res) => {
  const companies = await companiesService.listAllCompanies()
  res.json({ companies })
})

export const create = asyncHandler(async (req, res) => {
  const data = pickCompanyFields(req.body)
  if (!data.name) throw new ApiError(400, 'Company name is required')
  if (req.file) {
    data.logo = req.file.path
    data.logoPublicId = req.file.filename
  }
  data.createdBy = req.user.id

  const company = await companiesService.createCompany(data)
  res.status(201).json({ company })
})

export const update = asyncHandler(async (req, res) => {
  const data = pickCompanyFields(req.body)
  if (req.file) {
    data.logo = req.file.path
    data.logoPublicId = req.file.filename
  }
  const company = await companiesService.updateCompany(req.params.id, data)
  res.json({ company })
})

export const remove = asyncHandler(async (req, res) => {
  const result = await companiesService.deleteCompany(req.params.id)
  res.json(result)
})

export const bulkImport = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A CSV or Excel file is required')
  const rows = parseCompanyFile(req.file.buffer, req.file.originalname, {
    defaultIndustry: req.body.defaultIndustry?.trim() || '',
  })
  if (rows.length === 0) {
    throw new ApiError(400, 'No usable rows found — make sure the file has a company name in every row')
  }
  const summary = await companiesService.bulkImportCompanies(rows, req.user.id)
  res.json(summary)
})
