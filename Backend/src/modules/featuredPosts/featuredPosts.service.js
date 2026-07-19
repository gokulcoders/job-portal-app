import FeaturedPost from '../../models/FeaturedPost.js'
import { ApiError } from '../../utils/ApiError.js'
import cloudinary from '../../config/cloudinary.js'

async function destroyImage(publicId) {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, err.message)
  }
}

export async function listActivePosts(page) {
  const filter = { isActive: true }
  if (page) filter.page = page
  return FeaturedPost.find(filter).sort({ createdAt: -1 }).lean()
}

export async function listAllPosts() {
  return FeaturedPost.find().sort({ createdAt: -1 }).lean()
}

export async function createPost({ page, title, company, place, lastDate, link, content, image, imagePublicId, createdBy }) {
  return FeaturedPost.create({ page, title, company, place, lastDate, link, content, image, imagePublicId, createdBy })
}

export async function deletePost(id) {
  const post = await FeaturedPost.findByIdAndDelete(id)
  if (!post) throw new ApiError(404, 'Post not found')
  await destroyImage(post.imagePublicId)
  return { deleted: true }
}

// Deletes posts whose deadline has fully passed (kept visible through their lastDate
// calendar day — only removed once that day is over) and their Cloudinary images.
export async function deleteExpiredPosts() {
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)

  const expired = await FeaturedPost.find({ lastDate: { $lt: cutoff } }).select('_id imagePublicId')
  if (expired.length === 0) return 0

  await Promise.all(expired.map(p => destroyImage(p.imagePublicId)))
  await FeaturedPost.deleteMany({ _id: { $in: expired.map(p => p._id) } })
  return expired.length
}
