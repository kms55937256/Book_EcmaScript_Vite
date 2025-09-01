// API 서비스 모듈 - Book 관리용
const API_BASE_URL = 'http://localhost:8080'

// 공통 request 함수
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const { method = 'GET', body, headers = {} } = options

  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    console.log(`API 요청: ${method} ${url}`)
    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = getErrorMessage(response.status, errorData)
      throw new Error(errorMessage)
    }

    if (method === 'DELETE') return null
    return await response.json()
  } catch (error) {
    console.error('API 요청 오류:', error)
    if (error.name === 'TypeError') {
      throw new Error('네트워크 연결을 확인해주세요.')
    }
    throw error
  }
}

const getErrorMessage = (status, errorData) => {
  const serverMessage = errorData.message || '알 수 없는 오류가 발생했습니다.'
  if (status === 400) return `입력데이터 오류: ${serverMessage}`
  if (status === 404) return `데이터가 존재하지 않음: ${serverMessage}`
  if (status === 409) return `중복 오류: ${serverMessage}`
  if (status === 500) return `서버 오류: ${serverMessage}`
  return `오류 (${status}): ${serverMessage}`
}

// 도서 API 서비스 객체
export const apiService = {
  getBooks: async () => await request('/api/books'),
  getBook: async (bookId) => {
    if (!bookId) throw new Error('도서 ID가 필요합니다.')
    return await request(`/api/books/${bookId}`)
  },
  createBook: async (bookData) => {
    if (!bookData) throw new Error('도서 데이터가 필요합니다.')
    return await request('/api/books', { method: 'POST', body: bookData })
  },
  updateBook: async (bookId, bookData) => {
    if (!bookId) throw new Error('도서 ID가 필요합니다.')
    if (!bookData) throw new Error('도서 데이터가 필요합니다.')
    return await request(`/api/books/${bookId}`, { method: 'PUT', body: bookData })
  },
  deleteBook: async (bookId) => {
    if (!bookId) throw new Error('도서 ID가 필요합니다.')
    return await request(`/api/books/${bookId}`, { method: 'DELETE' })
  }
}