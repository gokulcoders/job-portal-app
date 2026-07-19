import Tenant from '../../models/Tenant.js'
import User from '../../models/User.js'
import { ApiError } from '../../utils/ApiError.js'

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function listTenants() {
  const tenants = await Tenant.find().sort({ createdAt: -1 }).lean()
  const counts = await User.aggregate([
    { $match: { tenantId: { $ne: null } } },
    { $group: { _id: '$tenantId', count: { $sum: 1 } } },
  ])
  const countMap = Object.fromEntries(counts.map(c => [c._id, c.count]))
  return tenants.map(t => ({ ...t, memberCount: countMap[t._id.toString()] || 0 }))
}

export async function createTenant({ name, contactEmail, plan, createdBy }) {
  const baseSlug = slugify(name)
  if (!baseSlug) throw new ApiError(400, 'Tenant name is required')

  let slug = baseSlug
  let suffix = 1
  while (await Tenant.exists({ slug })) {
    slug = `${baseSlug}-${++suffix}`
  }

  return Tenant.create({ name, slug, contactEmail, plan, createdBy })
}

export async function updateTenant(id, data) {
  const allowed = ['name', 'contactEmail', 'plan', 'status']
  const patch = {}
  for (const key of allowed) {
    if (data[key] !== undefined) patch[key] = data[key]
  }
  const tenant = await Tenant.findByIdAndUpdate(id, patch, { new: true, runValidators: true })
  if (!tenant) throw new ApiError(404, 'Tenant not found')
  return tenant
}

export async function deleteTenant(id) {
  const tenant = await Tenant.findByIdAndDelete(id)
  if (!tenant) throw new ApiError(404, 'Tenant not found')
  // Members aren't deleted — just detached from the removed tenant.
  await User.updateMany({ tenantId: id.toString() }, { tenantId: null })
  return { deleted: true }
}

export async function assignUserTenant(userId, tenantId) {
  if (tenantId) {
    const exists = await Tenant.exists({ _id: tenantId })
    if (!exists) throw new ApiError(404, 'Tenant not found')
  }
  const user = await User.findByIdAndUpdate(userId, { tenantId: tenantId || null }, { new: true }).select('_id name email tenantId')
  if (!user) throw new ApiError(404, 'User not found')
  return user
}
