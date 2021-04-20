var express    = require('express');
var PrinterModel  = require('../models/PrintersModel.js');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })






var router = express.Router();

router.get('/home',(req,res)=>{
 res.render('demo');
});

function GetAddressFromReq(req) {
    var RemoteIp = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;
    RemoteIp = RemoteIp.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"

    console.log("--- RemoteIp: "+RemoteIp) 
    return RemoteIp;
}

router.get('/GetNextJobDetails',(req,res)=>{
       var PrinterIdentifier = req.query.PrinterIdentifier;
       console.log("--- PrinterIdentifier: "+PrinterIdentifier);
       PrinterModel.GetNextJobDetails(PrinterIdentifier , (err,PrinterData)=>{
          if(err){
              console.log("Error= " + err);
              res.sendStatus( 500 ); //500 Internal Server Error
          }else{
              if (PrinterData && PrinterData.Jobs.length > 0 ) {
                 res.jsonp(PrinterData.Jobs[0]);
              }else{
                res.sendStatus( 204 ); //204 NO CONTENT
              }
          }
  });

 });

router.get('/GetJobInfo',(req,res)=>{
       var PrinterIdentifier = req.query.PrinterIdentifier;
       var JobId = (req.query.JobId);
       PrinterModel.GetJobInfo(PrinterIdentifier, JobId, (err,PrinterData)=>{
          if(err){
              console.log("Error= " + err);
              res.sendStatus( 500 ); //500 Internal Server Error
          }else{
              if (PrinterData && PrinterData.Jobs.length > 0 ) {
                 res.jsonp(PrinterData.Jobs[0]);
              }else{
                res.sendStatus( 204 ); //204 NO CONTENT
              }
          }
  });

 });



router.get('/GetJob',(req,res)=>{
       var PrinterIdentifier = (req.query.PrinterIdentifier);
       var JobId = (req.query.JobId);
       PrinterModel.GetJobInfo(PrinterIdentifier, JobId, (err,PrinterData)=>{
          if(err){
              console.log("Error= " + err);
              res.sendStatus( 500 ); //500 Internal Server Error
          }else{
              if (PrinterData && PrinterData.Jobs.length > 0 ) {
                 res.download(PrinterData.Jobs[0].JobPath);
              }else{
                res.sendStatus( 204 ); //204 NO CONTENT
              }
          }
  });

 });

router.get('/StartJob',(req,res)=>{
       var PrinterIdentifier = (req.query.PrinterIdentifier);
       PrinterModel.StartJob(PrinterIdentifier  ,(err,PrinterData)=>{
          if(err){
              console.log("Error= " + err);
              res.sendStatus( 500 ); //500 Internal Server Error
          }else{
                  res.sendStatus( 200 );
          }
  });

 });

router.get(['/NotifyJobActive','/CancelJob'],(req,res)=>{
       var PrinterIdentifier = (req.query.PrinterIdentifier);
       var JobId = (req.query.JobId);
       console.log("PrinterIdentifier= " + PrinterIdentifier);
       console.log("JobId= " + JobId);
       PrinterModel.ChangeJobStatus(PrinterIdentifier, JobId , "Started"  ,(err,PrinterData)=>{
          if(err){
              console.log("Error= " + err);
              res.sendStatus( 500 ); //500 Internal Server Error
          }else{
                  res.sendStatus( 200 );
          }
  });

 });


router.post('/NewJob', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  console.log(req.body.JobName);
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  PrinterModel.addJobToPrinter(req.body.PrinterName , req.body.JobName , file.path,(err )=>{
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
              Name:req.body.PrinterName,
              Address:req.body.Address
          });
          PrinterModel.addPrinter(PM,(err,PrinterData)=>{
              if(err){
                  res.json({msg:'error'});
              }else{
                  res.json({msg:'success'});
              }
          });
});

router.get('/UpdateJobMetadata',(req,res)=>{

    console.log(req.query.ServerJobId); 
    console.log(req.query["PCB::PrintTimeInHours"]); 
    /*
    for (var propName in req.query) 
    {
      if (req.query.hasOwnProperty(propName)) {
      console.log(propName, req.query[propName]);
      }
    }
    */
    PrinterModel.UpdateJobMetaData(req.query.ServerJobId , req.query["PCB::PrintTimeInHours"] ,(err,PrinterData)=>{
        if(err){
          console.log("Error= " + err);
          res.sendStatus( 500 ); //500 Internal Server Error
        }else{
          res.sendStatus( 200 );
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
