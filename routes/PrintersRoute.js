var express    = require('express');
var PrinterModel  = require('../models/PrintersModel.js');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })






var router = express.Router();

router.get('/home',(req,res)=>{
 res.render('demo');
});

router.post('/NewJob', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  console.log(req.body.PrinterName);
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  PrinterModel.addJobToPrinter(req.body.PrinterName,file.path,(err )=>{
              if(err){
                  console.log(err);
              }else{
                  console.log('success');
              }
          });
  res.send(file)

}) 


router.post('/AddPrinter',(req,res)=>{
          var PM = new PrinterModel({
              Name:req.body.PrinterName
          });
          PrinterModel.addPrinter(PM,(err,PrinterData)=>{
              if(err){
                  res.json({msg:'error'});
              }else{
                  res.json({msg:'success'});
              }
          });
});

router.get('/GetPrinters',(req,res)=>{
  PrinterModel.getPrinter((err,PrinterData)=>{
          if(err){
              res.json({msg:'error'});
          }else{
              res.json({msg:'success',data:PrinterData});
          }
  });
});

router.delete('/RemovePrinter',(req,res)=>{
      PrinterModel.removePrinter(req.body.id,(err,PrinterData)=>{
            if(err){
                res.json({msg:'error'});
            }else{
                res.json({msg:'success'});
            }
      });
});

module.exports = router;
