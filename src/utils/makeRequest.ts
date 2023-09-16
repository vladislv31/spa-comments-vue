import router from '../router'

export const makeRequest = async (url, method, headers, body) => {
  const response = await fetch(url, {
    method,
    headers,
    body
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error((await response.json()).message[0])
    } else if (response.status === 401) {
      router.push('/login')
    } else if (response.status === 409) {
      throw new Error((await response.json()).message)
    }
    throw new Error('Unexpected error')
  }

  return response
}
