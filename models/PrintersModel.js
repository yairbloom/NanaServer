var mongoose = require('mongoose');

var PrintersSchema = new mongoose.Schema({
    Name:{
        type:String,
        unique: true
    },
    Address:{
        type:String

    },
    Jobs:[{JobName : String , 
           JobPath : String,
           JobStatus: {
              type: String,
              enum : ['New','Started','Finish','Failed'],
              default: 'New'
    }}]
});

var PrinterModel =  module.exports = mongoose.model('printers',PrintersSchema);

module.exports.addPrinter = (Printers,cb)=>{
    Printers.save((err,PrinterData)=>{
            if(err){
                cb(err,null);
            }else{
                cb(null,PrinterData);
                }
    });
}

module.exports.getPrinter = (cb)=>{
    PrinterModel.find((err,PrinterData)=>{
          if(err){
              cb(err,null);
          }else{
              cb(null,PrinterData);
          }
    });
}

module.exports.getOnePrinter = (PrinterAddress , cb)=>{
    PrinterModel.findOne({'Address':PrinterAddress},(err,PrinterData)=>{
          if(err){
              cb(err,null);
          }else{
              cb(null,PrinterData);
          }
    });
}


module.exports.removePrinter = (id,cb)=>{
    PrinterModel.deleteOne({'_id':id},(err,PrinterData)=>{
            if(err){
                cb(err,null);
            }else{
                cb(null,PrinterData);
            }
    });
}

module.exports.addJobToPrinter = (PrinterName, JobName , JobPath ,cb)=>{
  var filter=null;
  if (PrinterName)
  {
    filter={ "Name": PrinterName };
  }

  PrinterModel.updateMany(
       filter,
      { "$push": { "Jobs": { "JobName": JobName, "JobPath": JobPath } } },(err)=>{
      if(err){
        cb(err);
      }else{
        cb(null);
      }
      })

}

module.exports.RemoveFirstJob = (PrinterAddress, cb)=>{
  PrinterModel.updateOne(
      { "Address": PrinterAddress },
      { "$pop": { "Jobs":  -1} },(err)=>{
      if(err){
        cb(err);
      }else{
        cb(null);
      }
      })

}


module.exports.StartJob = (PrinterAddress, cb)=>{
      const query = { "Address": PrinterAddress, "Jobs.JobStatus": "New" };
      const updateDocument = {$set: { "Jobs.$.JobStatus": "Started" }};
      PrinterModel.updateOne(query , updateDocument ,(err)=>{
      if(err){
        cb(err);
      }else{
        cb(null);
      }
      })

}



