const express = require("express");
const { reset } = require("nodemon");
const router = express.Router();

router.get('/:id', function(req, res){
    if(req.params.id === "0") {
        let defaultEntry = require("../../../client/src/components/rich-text-editor/DefaultEntry.json")
        res.json(defaultEntry);
    } else {
        res.json([
            {
              "type": "heading-one",
              "children": [
                {
                  "text": "Sorry this doesn't exist"
                }
              ]
            }])
    }
});

module.exports = router;