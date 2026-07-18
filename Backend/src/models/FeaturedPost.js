import mongoose from 'mongoose'

// Admin-published banner posts shown on one of the public "opportunities" pages.
// Unlike the scraped Job collection, these are NOT subject to a TTL/auto-expiry index.
export const FEATURED_PAGES = ['jobs', 'urgent', 'internship', 'walkin']

const featuredPostSchema = new mongoose.Schema(
  {
    page:      { type: String, enum: FEATURED_PAGES, required: true, default: 'urgent' },
    title:     { type: String, trim: true, required: true },
    company:   { type: String, trim: true, default: '' },
    place:     { type: String, trim: true, default: '' },
    lastDate:  { type: String, trim: true, default: '' },
    link:      { type: String, trim: true, required: true },
    image:     { type: String, trim: true, default: '' },
    content:   { type: String, trim: true, default: '' },
    isActive:  { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

featuredPostSchema.index({ page: 1, isActive: 1 })

export default mongoose.model('FeaturedPost', featuredPostSchema)
