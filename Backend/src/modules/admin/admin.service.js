import User from '../../models/User.js'
import * as notificationsService from '../notifications/notifications.service.js'

const SAFE_FIELDS = 'name email role isVerified isActive city country lastLoginAt createdAt'

export async function listUsers({ page = 1, limit = 20, q, role, status }) {
  const filter = {}
  if (q) {
    const re = new RegExp(q.trim(), 'i')
    filter.$or = [{ name: re }, { email: re }]
  }
  if (role) filter.role = role
  if (status === 'active')   filter.isActive = true
  if (status === 'inactive') filter.isActive = false

  const skip  = (page - 1) * limit
  const total = await User.countDocuments(filter)
  const users = await User.find(filter).select(SAFE_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit)

  return { users, total, page, pages: Math.ceil(total / limit) }
}

export async function getUserStats() {
  const [total, active, admins, superAdmins] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'super_admin' }),
  ])
  return { total, active, inactive: total - active, admins: admins + superAdmins }
}

export async function getUserById(id) {
  const user = await User.findById(id).select(SAFE_FIELDS)
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return user
}

export async function updateUserRole(id, role, requestingRole) {
  const valid = ['user', 'admin', 'super_admin']
  if (!valid.includes(role)) throw Object.assign(new Error('Invalid role'), { status: 400 })

  // Only super_admin can promote to super_admin
  if (role === 'super_admin' && requestingRole !== 'super_admin') {
    throw Object.assign(new Error('Only super admins can assign the super_admin role'), { status: 403 })
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select(SAFE_FIELDS)
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return user
}

export async function updateUserStatus(id, isActive) {
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select(SAFE_FIELDS)
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return user
}

export async function sendNotification(id, { message, type }, sentBy) {
  const user = await User.findById(id).select('_id')
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return notificationsService.createNotification({ recipient: id, message, type, sentBy })
}

export async function deleteUser(id, requestingUserId) {
  if (id === requestingUserId.toString()) {
    throw Object.assign(new Error('You cannot delete your own account'), { status: 400 })
  }
  const user = await User.findByIdAndDelete(id)
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return { deleted: true }
}
