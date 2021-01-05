var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var path        = require('path');
var $           = require('jquery');
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


//connect to db
mongoose.connect('mongodb://localhost:27017/ajaxdemo',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('connection error',err))

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//set the path of the jquery file to be used from the node_module jquery package
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist/')));

//set static folder(public) path
app.use(express.static(path.join(__dirname+'/public')));

//default page load
app.get('/',(req,res)=>{
  res.redirect('/printers/home');
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)

  }
  res.send(file)
})

//routes
app.use('/printers',require('./routes/PrintersRoute'));

//assign port
var port  = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));
