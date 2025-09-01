import { stringUtils } from '../utils/helpers'
const { isEmpty, safeTrim } = stringUtils

// 정규식 패턴들
export const patterns = {
  isbn: /^[0-9]{10,13}$/, // ISBN: 10자리 또는 13자리 숫자
  price: /^\d+$/ // 가격: 숫자만
}

// 에러 메시지
export const messages = {
  required: {
    title: '제목을 입력해주세요.',
    author: '저자를 입력해주세요.',
    isbn: 'ISBN을 입력해주세요.',
    price: '가격을 입력해주세요.'
  },
  format: {
    isbn: 'ISBN은 숫자 10자리 또는 13자리로 입력해주세요.',
    price: '가격은 숫자만 입력 가능합니다.'
  }
}

// 개별 필드 검증 함수
const validators = {
  title: (title) => {
    if (isEmpty(title)) return { isValid: false, message: messages.required.title, field: 'title' }
    if (safeTrim(title).length < 2) return { isValid: false, message: '제목은 최소 2글자 이상이어야 합니다.', field: 'title' }
    return { isValid: true }
  },
  author: (author) => {
    if (isEmpty(author)) return { isValid: false, message: messages.required.author, field: 'author' }
    return { isValid: true }
  },
  isbn: (isbn) => {
    if (isEmpty(isbn)) return { isValid: false, message: messages.required.isbn, field: 'isbn' }
    if (!patterns.isbn.test(safeTrim(isbn))) return { isValid: false, message: messages.format.isbn, field: 'isbn' }
    return { isValid: true }
  },
  price: (price) => {
    if (isEmpty(price)) return { isValid: false, message: messages.required.price, field: 'price' }
    if (!patterns.price.test(safeTrim(price))) return { isValid: false, message: messages.format.price, field: 'price' }
    return { isValid: true }
  }
}

// 전체 도서 데이터 검증
export const validateBook = (book) => {
  if (!book) return { isValid: false, message: '도서 데이터가 필요합니다.' }
  const { title, author, isbn, price } = book

  const titleResult = validators.title(title)
  if (!titleResult.isValid) return titleResult

  const authorResult = validators.author(author)
  if (!authorResult.isValid) return authorResult

  const isbnResult = validators.isbn(isbn)
  if (!isbnResult.isValid) return isbnResult

  const priceResult = validators.price(price)
  if (!priceResult.isValid) return priceResult

  return { isValid: true }
}

// 개별 필드 검증
export const validateField = (fieldName, value) => {
  const validator = validators[fieldName]
  if (!validator) return { isValid: true, message: '알 수 없는 필드입니다.' }
  return validator(value)
}