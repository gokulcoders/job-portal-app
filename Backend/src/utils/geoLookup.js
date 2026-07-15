// Best-effort IP → location lookup. Registration must never fail because of
// this, so any error just results in no geoInfo being stored.
export async function geoLookup(ipAddress) {
  if (!ipAddress || !process.env.GEO_API_URL) return null

  try {
    const res = await fetch(`${process.env.GEO_API_URL}/${ipAddress}`)
    const data = await res.json()
    if (data.status !== 'success') return null

    return {
      city: data.city,
      regionName: data.regionName,
      country: data.country,
      isp: data.isp,
    }
  } catch {
    return null
  }
}
