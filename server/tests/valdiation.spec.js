const { expect } = require('chai');
const v = require('../validation');

describe('Validation Functions:', function() {
    describe('The validate username function', function() {
        it('should not allow empty strings', function() {
            const result = v.validUsername("");
            expect(result).to.be.eq(false);
        });
    
        it('should not allow capital letters', function() {
            const result = v.validUsername('BM639');
            expect(result).to.be.eq(false);
        });
    
        it('should not have special characters', function() {
            const result = v.validUsername('bm63"');
            expect(result).to.be.eq(false);
        });
    
        it('should not allow usernames under 5 characters', function() {
            const result = v.validUsername('bm63');
            expect(result).to.be.eq(false);
        })
    
        it('should not allow usernames over 6 characters', function() {
            const result = v.validUsername('bm63900');
            expect(result).to.be.eq(false);
        })
    
        it('should not allow booleans', function() {
            const result = v.validUsername(true);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow objects', function() {
            const obj = {"object": "this is an object"};
            const result = v.validUsername(obj);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow numbers', function() {
            const result = v.validUsername(11111);
            expect(result).to.be.eq(false);
        })
    })
    
    describe('The validate email function', function() {
        it('should not allow non-bath email addresses', function() {
            const result = v.validEmail("bm639@gmail.com");
            expect(result).to.be.eq(false);
        })
        
        it('should not allow empty strings', function() {
            const result = v.validEmail("");
            expect(result).to.be.eq(false);
        });
    
        it('should not allow capital letters in the username', function() {
            const result = v.validEmail('BM639@bath.ac.uk');
            expect(result).to.be.eq(false);
        });
    
        it('should not have special characters in the username', function() {
            const result = v.validEmail('bm63"@bath.ac.uk');
            expect(result).to.be.eq(false);
        });
    
        it('should not allow booleans', function() {
            const result = v.validEmail(true);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow objects', function() {
            const obj = {"object": "this is an object"};
            const result = v.validEmail(obj);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow numbers', function() {
            const result = v.validEmail(1);
            expect(result).to.be.eq(false);
        })
    })
    
    describe('The validate password function', function() {
        it('should not allow length below 8', function() {
            const result = v.validPassword("p4$$Wor");
            expect(result).to.be.eq(false);
        })
    
        it('should not allow length above 12', function() {
            const result = v.validPassword('p4$$Wordp4$$W');
            expect(result).to.be.eq(false);
        });
    
        it('should not allow empty strings', function() {
            const result = v.validPassword("");
            expect(result).to.be.eq(false);
        });
    
        it('should require special characters', function() {
            const result = v.validPassword('Password');
            expect(result).to.be.eq(false);
        });
    
        it('should require numbers', function() {
            const result = v.validPassword('Pa$$word');
            expect(result).to.be.eq(false);
        });
    
        it('should require lowercase letters', function() {
            const result = v.validPassword('P4$$WORD');
            expect(result).to.be.eq(false);
        });
    
        it('should require uppercase letters', function() {
            const result = v.validPassword('p4$$word');
            expect(result).to.be.eq(false);
        })
    
        it('should not allow booleans', function() {
            const result = v.validPassword(true);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow objects', function() {
            const obj = {"object": "this is an object"};
            const result = v.validPassword(obj);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow numbers', function() {
            const result = v.validPassword(1);
            expect(result).to.be.eq(false);
        })
    })
    
    describe('The validate unit code function', function() {
        it('should not allow length below 7', function() {
            const result = v.validUnitCode("CM3022");
            expect(result).to.be.eq(false);
        })
    
        it('should not allow length above 8', function() {
            const result = v.validUnitCode("CM3022555");
            expect(result).to.be.eq(false);
        })
    
        it('should not contain lowercase letters', function() {
            const result = v.validUnitCode("cm30225");
            expect(result).to.be.eq(false);
        })
    
        it('should not contain special characters', function() {
            const result = v.validUnitCode("cm30/25");
            expect(result).to.be.eq(false);
        })
    
        it('should contain numbers unless code is "GENERAL"', function() {
            const result = v.validUnitCode("cmthree")
            expect(result).to.be.eq(false);
        })
    
        it('should not allow booleans', function() {
            const result = v.validUnitCode(true);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow objects', function() {
            const obj = {"object": "this is an object"};
            const result = v.validUnitCode(obj);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow numbers', function() {
            const result = v.validUnitCode(1);
            expect(result).to.be.eq(false);
        })
    })
    
    describe('the validate id function', function() {
        it('should not allow values below 1', function() {
            const result = v.validId(0);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow non-integer numbers', function() {
            const result = v.validId(0.1);
            expect(result).to.be.eq(false);
        })
    
        it('should not allow non-integer strings', function() {
            const result1 = v.validId("0.1");
            const result2 = v.validId("1");
            const result3 = v.validId("-1");
            const result4 = v.validId("a");
            expect(result2 === true && result1 === false && result3 === false && result4 === false).to.be.eq(true);
        })
    
        it('should not allow objects', function() {
            const result = v.validId({"object" : "I am object"});
            expect(result).to.be.eq(false);
        })
    
        it('should not allow booleans', function() {
            const result = v.validId(true);
            expect(result).to.be.eq(false);
        })
    })
    
    describe('the validate titles function', function() {
        it('should require letters', function() {
            const result = v.validTitle("12412....");
            expect(result).to.be.eq(false);
        })
    
        it('should not allow empty strings', function() {
            const result = v.validTitle("");
            expect(result).to.be.eq(false);
        })
    
        it('should not allow lengths over 50', function() {
            const test = "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghij1";
            const result = v.validTitle(test);
            expect(result).to.be.eq(false);
        })
    })
    
    describe('the add tags function', function() {
        it('should replace all illegal characters with the corresponding tag', function() {
            const test = "\0\x08\x09\x1a\n\r\"'\\%";
            const result = v.addTags(test);
            expect(result).to.be.eq("<aaa><bbb><ccc><ddd><eee><fff><ggg><hhh><iii><jjj>");
        })
    })
    
    describe('the remove tags function', function() {
        it('should replace all tags with the corresponding illegal character', function() {
            const test = "<aaa><bbb><ccc><ddd><eee><fff><ggg><hhh><iii><jjj>";
            const result = v.removeTags(test);
            expect(result).to.be.eq("\0\x08\x09\x1a\n\r\"'\\%");
        })
    })
})
