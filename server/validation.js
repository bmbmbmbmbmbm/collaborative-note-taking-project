function addTags(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "<aaa>";
      case "\x08":
        return "<bbb>";
      case "\x09":
        return "<ccc>";
      case "\x1a":
        return "<ddd>";
      case "\n":
        return "<eee>";
      case "\r":
        return "<fff>";
      case "\"":
        return "<ggg>";
      case "'":
        return "<hhh>";
      case "\\":
        return "<iii>";
      case "%":
        return "<jjj>";
    }
  });
}

function removeTags(str) {
  return str.replace(/<aaa>|<bbb>|<ccc>|<ddd>|<eee>|<fff>|<ggg>|<hhh>|<iii>|<jjj>/g, function (sub) {
    switch (sub) {
      case "<aaa>":
        return "\0";
      case "<bbb>":
        return "\x08";
      case "<ccc>":
        return "\x09";
      case "<ddd>":
        return "\x1a";
      case "<eee>":
        return "\n";
      case "<fff>":
        return "\r";
      case "<ggg>":
        return "\"";
      case "<hhh>":
        return "'";
      case "<iii>":
        return "\\";
      case "<jjj>":
        return "%";
    }
  })
}

function containsSpecial(string) {
  const special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  return special.test(string)
}

function containsAlphanumeric(string) {
  const alphanumeric = /^[a-z0-9]*$/
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

      return domain === domainName && validUsername(username);
    }
  }
  return false
}

function validUsername(string) {
  return string && !containsSpecial(string) && containsAlphanumeric(string);
}

function validTitle(string) {
  return string && string.length < 64 && string.length > 0 && containsAlphanumeric(string);
}

function validId(value) {
  return Number.isInteger(+value) && +value > 0;
}

function validContent(text) {
  return text.split(" ").length < 1000 && text.length > 0;
}

function validUnitCode(text) {
  return containsAlphanumeric(text) && !containsSpecial(text) && text.length > 6 && text.length < 9;
}

module.exports = {
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
}