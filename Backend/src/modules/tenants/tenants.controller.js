import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js'
import * as tenantsService from './tenants.service.js'

export const list = asyncHandler(async (req, res) => {
  const tenants = await tenantsService.listTenants()
  res.json({ tenants })
})

export const create = asyncHandler(async (req, res) => {
  const { name, contactEmail, plan } = req.body
  if (!name?.trim()) throw new ApiError(400, 'Tenant name is required')

  const tenant = await tenantsService.createTenant({
    name: name.trim(),
    contactEmail: contactEmail?.trim() || '',
    plan,
    createdBy: req.user.id,
  })
  res.status(201).json({ tenant })
})

export const update = asyncHandler(async (req, res) => {
  const tenant = await tenantsService.updateTenant(req.params.id, req.body)
  res.json({ tenant })
})

export const remove = asyncHandler(async (req, res) => {
  const result = await tenantsService.deleteTenant(req.params.id)
  res.json(result)
})
