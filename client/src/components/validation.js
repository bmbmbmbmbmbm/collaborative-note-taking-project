function containsSpecial(string) {
  const special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return special.test(string);
}

function containsAlphanumeric(string) {
  const alphabet = /[a-z]/;
  const numbers = /[0-9]/;
  return alphabet.test(string) && numbers.test(string);
}

function containsCapAlphanumeric(string) {
  const alphabet = /[A-Z]/;
  const numbers = /[0-9]/;
  return alphabet.test(string) && numbers.test(string);
}

function containsLetters(string) {
  const alphabet = /[a-zA-Z]/;
  return alphabet.test(string);
}

function validPassword(string) {
  const conditions = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;
  return conditions.test(string);
}

function validEmail(string, domainName) {
  if (string) {
    if(string === '') return false;
    if (string.indexOf('@') !== undefined) {
      const domain = string.substring(string.indexOf('@'));
      const username = string.substring(0, string.indexOf('@'));

      return domain === domainName && validUsername(username);
    }
  }
  return false;
}

function validUsername(string) {
  if(string === '') return false;
  return string && !containsSpecial(string) && containsAlphanumeric(string) && string.length > 4 && string.length < 7;
}

function validTitle(string) {
  if(string === '') return false;
  return string && string.length < 51 && string.length > 0 && containsLetters(string);
}

function validId(value) {
  return Number.isInteger(+value) && +value > 0;
}

function validContent(text) {
  return text.split(" ").length < 1000 && text.length > 0;
}

function validUnitCode(string) {
  return containsLetters(string) && containsCapAlphanumeric(string) && !containsSpecial(string) && string.length > 6 && string.length < 9;
}

module.exports = {
  containsSpecial,
  containsAlphanumeric,
  validEmail,
  validPassword,
  validUsername,
  validTitle,
  validId,
  validContent,
  validUnitCode,
}