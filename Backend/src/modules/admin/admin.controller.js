import * as adminService from './admin.service.js'

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, q, role, status, plan } = req.query
  const result = await adminService.listUsers({
    page:   parseInt(page)  || 1,
    limit:  parseInt(limit) || 20,
    q, role, status, plan,
  })
  res.json(result)
})

export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getUserStats()
  res.json({ stats })
})

export const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id)
  res.json({ user })
})

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  const user = await adminService.updateUserRole(req.params.id, role, req.user.role)
  res.json({ user })
})

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body
  const user = await adminService.updateUserStatus(req.params.id, isActive)
  res.json({ user })
})

export const updateUserPlan = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserPlan(req.params.id, req.body.plan)
  res.json({ user })
})

export const updateUserTenant = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserTenant(req.params.id, req.body.tenantId)
  res.json({ user })
})

export const sendUserNotification = asyncHandler(async (req, res) => {
  const { message, type } = req.body
  if (!message?.trim()) {
    return res.status(400).json({ message: 'Notification message is required' })
  }
  const notification = await adminService.sendNotification(
    req.params.id,
    { message: message.trim(), type },
    req.user.id
  )
  res.status(201).json({ notification })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.id, req.user.id)
  res.json(result)
})
