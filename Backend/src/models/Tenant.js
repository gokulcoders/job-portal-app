import mongoose from 'mongoose'

const tenantSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true, required: true },
    slug:         { type: String, trim: true, required: true, unique: true, lowercase: true },
    contactEmail: { type: String, trim: true, lowercase: true, default: '' },
    plan:         { type: String, enum: ['free', 'pro', 'teams'], default: 'free' },
    status:       { type: String, enum: ['active', 'suspended'], default: 'active' },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.model('Tenant', tenantSchema)
