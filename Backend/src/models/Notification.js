import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message:   { type: String, trim: true, required: true },
    type:      { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    isRead:    { type: Boolean, default: false },
    sentBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

notificationSchema.index({ recipient: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
