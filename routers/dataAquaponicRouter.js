//sebagai router data sensor
const express = require("express");
const router = express.Router();


router.get("/", async (req,res)=>{
   try {
      // const dataAquaponic = await dataAquaponicModel.find().limit(1)
      // res.json(dataAquaponic)
   } catch (error) {
      res.json({
         message:error
      })
   }
})

router.put("/addData", async (req, res) => {
   try {
   //   const dataAquaponic = new dataAquaponicModel({
   //        luasKolam : req.body.luasKolam,
   //        jumlahIkan : req.body.jumlahIkan,
   //        jenisIkan : req.body.jenisIkan,
   //        jenisTanaman : req.body.jenisTanaman,
   //   });

   //   const saveDataAquaponic = await dataAquaponic.save();
   //   res.json(saveDataAquaponic)
   } catch (error) {
      res.json({
         message:error
      })
   }
});

router.post("/", async (req, res)=>{
     console.log(req.body)
     res.send("data berhasil diterima")
});

module.exports = router;
