import mongoose from 'mongoose'

const internshipJobSchema = new mongoose.Schema(
  {
    title:        { type: String, trim: true, default: '' },
    company:      { type: String, trim: true, default: '' },
    companyLink:  { type: String, trim: true, default: '' },
    companyImage: { type: String, trim: true, default: '' },
    place:        { type: String, trim: true, default: '' },
    jobLink:      { type: String, required: true, unique: true, trim: true },
    applyLink:    { type: String, trim: true, default: '' },
    lastDate:     { type: String, trim: true, default: '' },
    keyword:      { type: String, trim: true, default: '' },
    source:       { type: String, trim: true, default: 'linkedin' },
    posterImage:  { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

internshipJobSchema.index({ jobLink: 1 }, { unique: true })
internshipJobSchema.index({ keyword: 1 })
internshipJobSchema.index({ company: 1 })
internshipJobSchema.index({ place: 1 })
internshipJobSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 })

export default mongoose.model('InternshipJob', internshipJobSchema)
