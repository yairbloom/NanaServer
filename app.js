var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var path        = require('path');
var $           = require('jquery');
var logger = require('morgan')

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
mongoose.connect('mongodb://localhost:27017/NanoDB',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('connection error',err))

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request

//set the path of the jquery file to be used from the node_module jquery package
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist/')));

//set static folder(public) path
app.use(express.static(path.join(__dirname+'/public')));

app.use(logger('short'))


//default page load
app.get('/',(req,res)=>{
  res.redirect('/printers/home');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//routes
app.use('/printers',require('./routes/PrintersRoute'));

//assign port
var port  = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));
