export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData) && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Crucial for sending session cookies
  }

  const response = await fetch(url, config)
  let result: ApiResponse<T>

  try {
    result = await response.json()
  } catch (err) {
    throw new Error(`Failed to parse response: ${response.statusText}`)
  }

  if (!response.ok || !(result.statusCode <= 299 && result.statusCode >= 200)) {
    throw new Error(result.message || `API request failed with status ${response.status}`)
  }

  return result.data
}
