import User from '../../models/User.js'

// Mock pricing — mirrors the plans shown on the public Pricing page and the
// user-facing Subscription page. No real payment gateway is wired up.
export const PLAN_PRICES = { free: 0, pro: 299, teams: 999 }

export async function getBillingStats() {
  const counts = await User.aggregate([
    { $group: { _id: '$plan', count: { $sum: 1 } } },
  ])
  const planCounts = { free: 0, pro: 0, teams: 0 }
  counts.forEach(c => { planCounts[c._id || 'free'] = c.count })

  const mrr = planCounts.pro * PLAN_PRICES.pro + planCounts.teams * PLAN_PRICES.teams
  const totalUsers = planCounts.free + planCounts.pro + planCounts.teams

  return { planCounts, mrr, totalUsers, planPrices: PLAN_PRICES }
}
