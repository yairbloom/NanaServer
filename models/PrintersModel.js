var mongoose = require('mongoose');

var PrintersSchema = new mongoose.Schema({
    Name:{
        type:String,
        unique: true
    },
    Address:{
        type:String

    },
    Jobs:[{JobName : String , JobPath : String}]
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
  PrinterModel.update(
      { "Name": PrinterName },
      { "$push": { "Jobs": { "JobName": JobName, "JobPath": JobPath } } },(err)=>{
      if(err){
        cb(err);
      }else{
        cb(null);
      }
      })

}



