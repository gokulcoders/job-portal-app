import mongoose from 'mongoose'

const geoInfoSchema = new mongoose.Schema(
  {
    city: String,
    regionName: String,
    country: String,
    isp: String,
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },

    role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
    tenantId: { type: String, default: null },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    phone: String,
    bio: String,
    city: String,
    country: String,
    postalCode: String,

    geoInfo: geoInfoSchema,
    refreshToken: { type: String, select: false },

    lastLoginAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
