import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    companyLink: { type: String, trim: true, default: '' },
    companyImage: { type: String, trim: true, default: '' },
    place: { type: String, trim: true, default: '' },
    jobLink: { type: String, required: true, unique: true, trim: true },
    applyLink: { type: String, trim: true, default: '' },
    lastDate: { type: String, trim: true, default: '' },
    keyword: { type: String, trim: true, default: '' },
    source: { type: String, trim: true, default: 'linkedin' },
  },
  { timestamps: true }
)

jobSchema.index({ jobLink: 1 }, { unique: true })
jobSchema.index({ keyword: 1 })
jobSchema.index({ company: 1 })
jobSchema.index({ place: 1 })

export default mongoose.model('Job', jobSchema)
