import { parse as parseCsv } from 'csv-parse/sync'
import * as XLSX from 'xlsx'
import { ApiError } from '../../utils/ApiError.js'

// Accepts a handful of common header spellings so admins don't have to match an exact template.
const HEADER_ALIASES = {
  name: 'name', company: 'name', companyname: 'name',
  industry: 'industry', sector: 'industry', category: 'industry',
  location: 'location', hq: 'location', place: 'location', city: 'location', district: 'location', address: 'location',
  size: 'size', companysize: 'size', employees: 'size',
  description: 'description', about: 'description', summary: 'description',
  website: 'website', url: 'website', link: 'website', websitelink: 'website',
  logo: 'logo', logourl: 'logo', logolink: 'logo',
  remotefriendly: 'remoteFriendly', remote: 'remoteFriendly',
}

// Fallback column order for header-less exports — this is the shape of a common Google
// Maps business-listing scrape: District, Name, Full address, Website, Phone, Maps link.
// Only the columns we actually use are mapped; the rest (phone, maps link) are ignored.
const POSITIONAL_FALLBACK = ['location', 'name', null, 'website']

function normalizeKey(key) {
  return String(key || '').trim().toLowerCase().replace(/[\s_-]/g, '')
}

function looksLikeHeaderRow(cells) {
  return cells.some(cell => HEADER_ALIASES[normalizeKey(cell)])
}

function finalizeRow(row, defaultIndustry) {
  if (row.remoteFriendly !== undefined) {
    row.remoteFriendly = ['true', 'yes', '1', 'y'].includes(String(row.remoteFriendly).trim().toLowerCase())
  }
  if (defaultIndustry && !row.industry) row.industry = defaultIndustry
  return row
}

function rowFromHeader(cells, headerRow, defaultIndustry) {
  const row = {}
  headerRow.forEach((header, i) => {
    const field = HEADER_ALIASES[normalizeKey(header)]
    if (!field) return
    const value = cells[i]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      row[field] = typeof value === 'string' ? value.trim() : value
    }
  })
  return finalizeRow(row, defaultIndustry)
}

function rowFromPositions(cells, defaultIndustry) {
  const row = {}
  POSITIONAL_FALLBACK.forEach((field, i) => {
    if (!field) return
    const value = cells[i]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      row[field] = String(value).trim()
    }
  })
  return finalizeRow(row, defaultIndustry)
}

function readRawRecords(buffer, ext) {
  if (ext === '.csv') {
    return parseCsv(buffer, { columns: false, skip_empty_lines: true, trim: true, bom: true, relax_column_count: true })
  }
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false })
}

// Parses an uploaded CSV or Excel file (held in memory, never persisted) into plain
// row objects keyed by our Company field names, ready for companies.service#bulkImportCompanies.
// Handles both a normal header row (name, industry, location, ...) and header-less exports
// (e.g. raw Google Maps business-listing scrapes) via a positional fallback.
export function parseCompanyFile(buffer, originalname, { defaultIndustry } = {}) {
  const ext = originalname.slice(originalname.lastIndexOf('.')).toLowerCase()

  let records
  try {
    records = readRawRecords(buffer, ext)
  } catch {
    throw new ApiError(400, 'Could not read that file — make sure it is a valid CSV or Excel file')
  }
  if (records.length === 0) return []

  const hasHeader = looksLikeHeaderRow(records[0])
  const headerRow = hasHeader ? records[0] : null
  const dataRows = hasHeader ? records.slice(1) : records

  const rows = dataRows.map(cells =>
    hasHeader ? rowFromHeader(cells, headerRow, defaultIndustry) : rowFromPositions(cells, defaultIndustry)
  )

  return rows.filter(row => row.name)
}
