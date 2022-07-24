const router = require("express").Router();

router.get("/", (req,res)=>{
    res.send("Reg Route");
});

module.exports = router;