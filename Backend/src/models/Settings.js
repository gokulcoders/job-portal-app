import mongoose from 'mongoose'

// Singleton — there is always exactly one Settings document (see settings.service.js).
const settingsSchema = new mongoose.Schema(
  {
    siteName:           { type: String, trim: true, default: 'HireVerse' },
    supportEmail:       { type: String, trim: true, default: '' },
    maintenanceMode:     { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    updatedBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.model('Settings', settingsSchema)
