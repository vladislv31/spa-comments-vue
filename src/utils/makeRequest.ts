import router from '../router'

export const makeRequest = async (uri, method, headers, body) => {
  const response = await fetch(`http://localhost:5000${uri}`, { // TODO: add to env
    method,
    headers,
    body
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error((await response.json()).message[0])
    } else if (response.status === 401) {
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      } else {
        throw new Error((await response.json()).message)
      }
    } else if (response.status === 403) {
      throw new Error((await response.json()).message)
    } else if (response.status === 409) {
      throw new Error((await response.json()).message)
    }
    throw new Error('Unexpected error')
  }

  return response
}
