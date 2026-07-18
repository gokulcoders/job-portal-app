import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js'
import { FEATURED_PAGES } from '../../models/FeaturedPost.js'
import * as featuredPostsService from './featuredPosts.service.js'

export const listPublic = asyncHandler(async (req, res) => {
  const { page } = req.query
  const posts = await featuredPostsService.listActivePosts(page)
  res.json({ posts })
})

export const listAll = asyncHandler(async (req, res) => {
  const posts = await featuredPostsService.listAllPosts()
  res.json({ posts })
})

export const create = asyncHandler(async (req, res) => {
  const { page, title, company, place, lastDate, link, content } = req.body
  if (!title?.trim() || !link?.trim()) {
    throw new ApiError(400, 'Title and link are required')
  }
  if (!FEATURED_PAGES.includes(page)) {
    throw new ApiError(400, `Page must be one of: ${FEATURED_PAGES.join(', ')}`)
  }

  const post = await featuredPostsService.createPost({
    page,
    title: title.trim(),
    company: company?.trim() || '',
    place: place?.trim() || '',
    lastDate: lastDate?.trim() || '',
    link: link.trim(),
    content: content?.trim() || '',
    image: req.file?.path || '',
    createdBy: req.user.id,
  })
  res.status(201).json({ post })
})

export const remove = asyncHandler(async (req, res) => {
  const result = await featuredPostsService.deletePost(req.params.id)
  res.json(result)
})
