import FeaturedPost from '../../models/FeaturedPost.js'
import { ApiError } from '../../utils/ApiError.js'

export async function listActivePosts(page) {
  const filter = { isActive: true }
  if (page) filter.page = page
  return FeaturedPost.find(filter).sort({ createdAt: -1 }).lean()
}

export async function listAllPosts() {
  return FeaturedPost.find().sort({ createdAt: -1 }).lean()
}

export async function createPost({ page, title, company, place, lastDate, link, content, image, createdBy }) {
  return FeaturedPost.create({ page, title, company, place, lastDate, link, content, image, createdBy })
}

export async function deletePost(id) {
  const post = await FeaturedPost.findByIdAndDelete(id)
  if (!post) throw new ApiError(404, 'Post not found')
  return { deleted: true }
}
