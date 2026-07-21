import multer from 'multer'

const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls']

function fileFilter(req, file, cb) {
  const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error('Only .csv, .xlsx or .xls files are supported'))
    return
  }
  cb(null, true)
}

// Bulk-import files are parsed in memory and discarded — never written to disk or stored.
export const uploadDataFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
})
