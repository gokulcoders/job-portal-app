import mongoose from 'mongoose'

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const courseSchema = new mongoose.Schema(
  {
    title:       { type: String, trim: true, required: true },
    description: { type: String, trim: true, default: '' },
    youtubeUrl:  { type: String, trim: true, required: true },
    youtubeId:   { type: String, trim: true, required: true },
    duration:    { type: Number, required: true }, // minutes
    category:    { type: String, trim: true, default: 'General' },
    level:       { type: String, enum: COURSE_LEVELS, default: 'Beginner' },
    instructor:  { type: String, trim: true, default: '' },
    price:       { type: String, trim: true, default: 'Free' },
    isActive:    { type: Boolean, default: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

courseSchema.index({ category: 1, isActive: 1 })

export default mongoose.model('Course', courseSchema)
