import mongoose from 'mongoose'

const courseProgressSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:          { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    watchedSeconds:  { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    completed:       { type: Boolean, default: false },
    lastWatchedAt:   { type: Date, default: Date.now },
    lastRemindedAt:  { type: Date, default: null },
  },
  { timestamps: true }
)

courseProgressSchema.index({ user: 1, course: 1 }, { unique: true })

export default mongoose.model('CourseProgress', courseProgressSchema)
