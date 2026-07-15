import jwt from 'jsonwebtoken'

export function signAccessToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  })
}

export function signRefreshToken(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

export async function issueTokens(user) {
  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  user.refreshToken = refreshToken
  await user.save()
  return { accessToken, refreshToken }
}
