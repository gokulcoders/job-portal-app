import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name:           { type: String, trim: true, required: true },
    logo:           { type: String, trim: true, default: '' },
    logoPublicId:   { type: String, trim: true, default: '' },
    industry:       { type: String, trim: true, default: '' },
    location:       { type: String, trim: true, default: '' },
    size:           { type: String, trim: true, default: '' },
    description:    { type: String, trim: true, default: '' },
    website:        { type: String, trim: true, default: '' },
    remoteFriendly: { type: Boolean, default: false },
    isActive:       { type: Boolean, default: true },
    createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

// Case-insensitive uniqueness on name — this is what "skip duplicates" is enforced against,
// both for manual admin creation and bulk file import.
companySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })
companySchema.index({ industry: 1, isActive: 1 })

export default mongoose.model('Company', companySchema)
