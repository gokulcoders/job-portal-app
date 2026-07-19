import Settings from '../../models/Settings.js'

let cache = null

export async function getSettings() {
  if (cache) return cache
  let doc = await Settings.findOne()
  if (!doc) doc = await Settings.create({})
  cache = doc
  return doc
}

export async function updateSettings(data, updatedBy) {
  const allowed = ['siteName', 'supportEmail', 'maintenanceMode', 'allowRegistrations']
  const patch = {}
  for (const key of allowed) {
    if (data[key] !== undefined) patch[key] = data[key]
  }
  patch.updatedBy = updatedBy

  let doc = await Settings.findOne()
  if (!doc) doc = new Settings()
  Object.assign(doc, patch)
  await doc.save()
  cache = doc
  return doc
}
