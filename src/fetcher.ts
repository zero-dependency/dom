interface FetcherInit
  extends Pick<
    RequestInit,
    'headers' | 'credentials' | 'mode' | 'cache' | 'redirect' | 'referrerPolicy'
  > {}

interface FetcherRequest extends Omit<RequestInit, 'method'> {}

type RequestMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class Fetcher {
  constructor(
    private readonly baseURL: string,
    private readonly baseInit: FetcherInit
  ) {}

  async request<T>(
    path: string,
    init: FetcherRequest & { method: RequestMethods }
  ): Promise<T> {
    const url = new URL(path, this.baseURL)
    return await fetcher<T>(url, { ...this.baseInit, ...init })
  }

  async get<T>(path: string, init?: FetcherRequest): Promise<T> {
    return await this.request(path, { ...init, method: 'GET' })
  }

  async post<T>(path: string, init?: FetcherRequest): Promise<T> {
    return await this.request(path, { ...init, method: 'POST' })
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
