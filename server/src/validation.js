/* eslint-disable no-control-regex */
function addTags (str) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case '\0':
        return '<aaa>'
      case '\x08':
        return '<bbb>'
      case '\x09':
        return '<ccc>'
      case '\x1a':
        return '<ddd>'
      case '\n':
        return '<eee>'
      case '\r':
        return '<fff>'
      case '"':
        return '<ggg>'
      case "'":
        return '<hhh>'
      case '\\':
        return '<iii>'
      case '%':
        return '<jjj>'
    }
  })
}

function removeTags (str) {
  return str.replace(/<aaa>|<bbb>|<ccc>|<ddd>|<eee>|<fff>|<ggg>|<hhh>|<iii>|<jjj>/g, function (sub) {
    switch (sub) {
      case '<aaa>':
        return '\0'
      case '<bbb>':
        return '\x08'
      case '<ccc>':
        return '\x09'
      case '<ddd>':
        return '\x1a'
      case '<eee>':
        return '\n'
      case '<fff>':
        return '\r'
      case '<ggg>':
        return '"'
      case '<hhh>':
        return "'"
      case '<iii>':
        return '\\'
      case '<jjj>':
        return '%'
    }
  })
}

function removeTagsFromTitles (record) {
  for (let i = 0; i < record[0].length; ++i) {
    record[0][i].title = removeTags(record[0][i].title)
  }
}

function removeTagsFromComments (record) {
  for (let i = 0; i < record[0].length; ++i) {
    record[0][i].reply.content = removeTags(record[0][i].reply.content)
  }
}

function containsSpecial (string) {
  // eslint-disable-next-line no-useless-escape
  const special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  return special.test(string)
}

function containsAlphanumeric (string) {
  const alphabet = /[a-z]/
  const numbers = /[0-9]/
  return alphabet.test(string) && numbers.test(string)
}

function containsCapAlphanumeric (string) {
  const alphabet = /[A-Z]/
  const numbers = /[0-9]/
  return alphabet.test(string) && numbers.test(string)
}

function containsLetters (string) {
  const alphabet = /[a-zA-Z]/
  return alphabet.test(string)
}

function validPassword (string) {
  const conditions = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/
  return conditions.test(string)
}

function validEmail (string, domainName) {
  if (string) {
    if (typeof string !== 'string') return false
    if (string === '') return false
    if (string.indexOf('@') !== undefined) {
      const domain = string.substring(string.indexOf('@'))
      const username = string.substring(0, string.indexOf('@'))

      return domain === domainName && validUsername(username)
    } else return false
  }
  return false
}

function validUsername (string) {
  if (typeof string !== 'string') return false
  if (string === '') return false
  return string && !containsSpecial(string) && containsAlphanumeric(string) && string.length > 4 && string.length < 7
}

function validTitle (string) {
  if (typeof string !== 'string') return false
  if (string === '') return false
  return string.length < 51 && string.length > 0 && containsLetters(string)
}

function validId (value) {
  if (typeof value === 'boolean') return false
  return Number.isInteger(+value) && +value > 0
}

function validContent (text) {
  if (typeof text !== 'string') return false
  return text.split(' ').length < 1000 && text.length > 0
}

function validUnitCode (string) {
  if (string === 'GENERAL') return true
  return containsCapAlphanumeric(string) && !containsSpecial(string) && string.length > 6 && string.length < 9
}

export {
  addTags,
  removeTags,
  containsSpecial,
  containsAlphanumeric,
  validEmail,
  validPassword,
  validUsername,
  validTitle,
  validId,
  validContent,
  validUnitCode,
  removeTagsFromTitles,
  removeTagsFromComments
}
