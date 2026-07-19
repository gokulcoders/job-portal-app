import mongoose from 'mongoose'

// Admin-published banner posts shown on one of the public "opportunities" pages.
// lastDate is the deadline — a cron job (see server.js) deletes the post (and its
// Cloudinary image) once that date has fully passed.
export const FEATURED_PAGES = ['jobs', 'urgent', 'internship', 'walkin']

const featuredPostSchema = new mongoose.Schema(
  {
    page:          { type: String, enum: FEATURED_PAGES, required: true, default: 'urgent' },
    title:         { type: String, trim: true, required: true },
    company:       { type: String, trim: true, default: '' },
    place:         { type: String, trim: true, default: '' },
    lastDate:      { type: Date, required: true },
    link:          { type: String, trim: true, required: true },
    image:         { type: String, trim: true, default: '' },
    imagePublicId: { type: String, trim: true, default: '' }, // Cloudinary public_id, used to delete the asset
    content:       { type: String, trim: true, default: '' },
    isActive:      { type: Boolean, default: true },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

featuredPostSchema.index({ page: 1, isActive: 1 })
featuredPostSchema.index({ lastDate: 1 })

export default mongoose.model('FeaturedPost', featuredPostSchema)
