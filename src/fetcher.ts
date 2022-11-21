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
type FetcherMethod = <T>(path: string, init?: FetcherRequest) => Promise<T>

export class Fetcher {
  get: FetcherMethod
  post: FetcherMethod
  put: FetcherMethod
  patch: FetcherMethod
  delete: FetcherMethod

  constructor(
    private readonly baseURL: string,
    private readonly baseInit?: FetcherInit
  ) {
    for (const method of methods) {
      // @ts-ignore
      this[method.toLowerCase()] = (path: string, init?: FetcherRequest) => {
        return this.request(path, { ...init, method })
      }
    }
  }

  extends(path: string, baseInit?: FetcherInit): Fetcher {
    const { url, init } = this.fetcherParameters(path, baseInit)
    return new Fetcher(url, init)
  }

  async request<T>(
    path: string,
    initRequest: FetcherRequest & { method: RequestMethods }
  ): Promise<T> {
    const { url, init } = this.fetcherParameters(path, initRequest)
    return await fetcher<T>(url, init)
  }

  private fetcherParameters(path: string, baseInit?: FetcherInit) {
    const url = combineURLs(this.baseURL, path)
    const headers = combineHeaders(this.baseInit?.headers, baseInit?.headers)
    const init = { ...this.baseInit, ...baseInit, headers }
    return { url, init }
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

// https://github.com/axios/axios/blob/v1.x/lib/helpers/combineURLs.js
function combineURLs(baseURL: string, path: string): string {
  return path
    ? baseURL.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
    : baseURL
}

function combineHeaders(...sources: HeadersInit[]): Headers {
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
