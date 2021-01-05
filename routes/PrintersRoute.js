var express    = require('express');
var PrinterModel  = require('../models/PrintersModel.js');

var router = express.Router();

router.get('/home',(req,res)=>{
 res.render('demo');
});


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
