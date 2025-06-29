export function createURLSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  const params = new URLSearchParams()
  for (const key in searchParams) {
    const value = searchParams[key]
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (typeof value === 'string') {
      params.append(key, value)
    }
  }
  return params
}