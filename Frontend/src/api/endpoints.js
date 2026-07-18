export const ENDPOINTS = {
  // Auth
  REGISTER:        '/auth/register',
  LOGIN:           '/auth/login',
  LOGOUT:          '/auth/logout',
  REFRESH:         '/auth/refresh',
  VERIFY_OTP:      '/auth/verify-otp',
  RESEND_OTP:      '/auth/resend-otp',
  ME:              '/auth/me',
  UPDATE_PROFILE:  '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD:  '/auth/reset-password',

  // Admin
  ADMIN_USERS:        '/api/admin/users',

  // Separate collections
  WALKIN_JOBS:        '/api/walkin-jobs',
  INTERNSHIP_JOBS:    '/api/internship-jobs',

  // Featured posts (admin-managed banners shown on the public opportunities pages)
  FEATURED_POSTS:        '/api/featured-posts',
  FEATURED_POSTS_ADMIN:  '/api/featured-posts/admin',

  // Notifications
  NOTIFICATIONS:          '/api/notifications',
}
