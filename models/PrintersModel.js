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
           PrintTimeInHours : String,
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

module.exports.GetNextJobDetails = (PrinterAddress , cb)=>{

  const query = { "Address": PrinterAddress};
  const projection = {Jobs:{ $elemMatch: { "JobStatus" : "New" }}};
  PrinterModel.findOne(query,projection , (err,PrinterData)=>{
    if(err){
      cb(err,null);
    }else{
      cb(null,PrinterData);
    }
});
}

module.exports.GetJobInfo = (PrinterAddress, JobId, cb)=>{

  const query = { "Address": PrinterAddress};
  const projection = {Jobs:{ $elemMatch: { "_id" : JobId }}};
  PrinterModel.findOne(query,projection , (err,PrinterData)=>{
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


module.exports.ChangeJobStatus = (PrinterAddress, JobId , JobStatus , cb)=>{
  const query = { "Address": PrinterAddress, "Jobs._id" : JobId};
  const updateDocument = {$set: { "Jobs.$.JobStatus": JobStatus }};
  const options = { upsert: true };
  PrinterModel.updateOne(query , updateDocument ,options , (err)=>{
      if(err){
        cb(err);
      }else{
        cb(null);
      }
    })

}


module.exports.UpdateJobMetaData = (JobId, TimeStr, cb)=>{
  const query = { "Jobs._id" : JobId};
  const updateDocument = {$set: { "Jobs.$.PrintTimeInHours": TimeStr }};
  const options = { upsert: true };
  PrinterModel.updateOne(query , updateDocument ,options , (err)=>{
      if(err){
        cb(err);
      }else{
        cb(null);
      }
      })

}




