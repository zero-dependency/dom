interface FetcherInit
  extends Pick<
    RequestInit,
    'headers' | 'credentials' | 'mode' | 'cache' | 'redirect' | 'referrerPolicy'
  > {}

interface FetcherRequest extends Omit<RequestInit, 'method'> {}

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
] as const

type RequestMethods = typeof methods[number]

export class Fetcher {
  get: <T>(path: string, init?: FetcherRequest) => Promise<T>
  post: <T>(path: string, init?: FetcherRequest) => Promise<T>
  put: <T>(path: string, init?: FetcherRequest) => Promise<T>
  patch: <T>(path: string, init?: FetcherRequest) => Promise<T>
  delete: <T>(path: string, init?: FetcherRequest) => Promise<T>

  constructor(
    private readonly baseURL: string,
    private readonly baseInit?: FetcherInit
  ) {
    for (const method of methods) {
      // @ts-ignore
      this[method.toLowerCase()] = (path: string, init?: FetcherRequest) =>
        this.request(path, { ...init, method })
    }
  }

  async request<T>(
    path: string,
    init: FetcherRequest & { method: RequestMethods }
  ): Promise<T> {
    const url = new URL(path, this.baseURL)
    const headers = mergeHeaders(this.baseInit?.headers!, init.headers!)
    return await fetcher<T>(url, { ...this.baseInit, ...init, headers })
  }
}

export async function fetcher<T = unknown>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const response = await fetch(...args)
  const data = (await response.json()) as T

  if (response.ok) {
    return data
  }

  throw new FetcherError({
    response,
    data
  })
}

export class FetcherError<T> extends Error {
  response: Response
  data: T

  constructor({ response, data }: { response: Response; data: T }) {
    super(response.statusText)

    this.name = 'FetcherError'
    this.response = response
    this.data = data
  }
}

function mergeHeaders(...sources: HeadersInit[]): Headers {
  const result: Record<string, string> = {}

  for (const source of sources) {
    const headers = new Headers(source)

    for (const [key, value] of headers.entries()) {
      if (value === undefined || value === null) {
        delete result[key]
      } else {
        result[key] = value
      }
    }
  }

  return new Headers(result)
}
