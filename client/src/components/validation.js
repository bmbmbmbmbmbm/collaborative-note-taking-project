function containsSpecial(string) {
  const special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  return special.test(string)
}

function containsAlphanumeric(string) {
  const alphanumeric = /[a-z0-9]/
  return alphanumeric.test(string)
}

function containsCapAlphanumeric(string) {
  const alphanumeric = /[a-zA-Z0-9]/
  return alphanumeric.test(string)
}

function validPassword(string) {
  const conditions = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/
  return conditions.test(string);
}

function validEmail(string, domainName) {
  if (string) {
    if (string.indexOf('@') !== undefined) {
      const domain = string.substring(string.indexOf('@'));
      const username = string.substring(0, string.indexOf('@'));
      console.log(username, domain);
      return domain === domainName && validUsername(username);
    }
  }
  return false
}

function validUsername(string) {
  return string && !containsSpecial(string) && containsAlphanumeric(string);
}

function validTitle(string) {
  return string && string.length < 51 && string.length > 0 && containsCapAlphanumeric(string);
}

function validId(value) {
  return Number.isInteger(+value) && +value > 0;
}

function validContent(text) {
  return text.split(" ").length < 1000 && text.length > 0;
}

function validUnitCode(text) {
  return containsCapAlphanumeric(text) && !containsSpecial(text) && text.length > 6 && text.length < 9;
}

export default {
  containsSpecial,
  containsAlphanumeric,
  validEmail,
  validPassword,
  validUsername,
  validTitle,
  validId,
  validContent,
  validUnitCode,
  containsCapAlphanumeric
}