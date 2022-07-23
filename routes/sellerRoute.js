const router = require('express').Router();

router.get("/", (req,res)=>{
    res.send("Seller Route");
})

module.exports = router;