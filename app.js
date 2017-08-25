var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

//mongoose.connect("mongodb://test:test@ds159493.mlab.com:59493/netgo7603");
mongoose.connect(process.env.MONGO_DB);

var db = mongoose.connection;

db.once("open", function() {
  console.log("db connection");
});

db.on("error",function(err){
  console.log("db error ", err);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data',dataSchema);
Data.findOne({name:"myData"},function(err,data){
  if(err) return console.log("Data Error :", err);
  if(!data){
    Data.create({name:"myData",count:0},function (err,data){
      if(err) return console.log("Data Error2 : ", err);
      console.log("Counter initalized :", data);
    });
  }
});

app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var data={count:0};
app.get('/add', function (req,res) {

  Data.findOne({name:"myData"},function(err,data){
    if(err) return console.log("Data Error :", err);
    data.count++;
    data.save(function (err)
    {
        if(err) return console.log("Data Error2 : ", err);
        res.render('my_first_ejs',data);
      });
  });
});

app.get('/reset', function (req,res) {
  data.count=0;
  res.render('my_first_ejs',data);
});
app.get('/set/count', function (req,res) {
  if(req.query.count) data.count=req.query.count;
  res.render('my_first_ejs',data);
});
app.get('/set/:num', function (req,res) {
  data.count=req.params.num;
  res.render('my_first_ejs',data);
});

app.listen(3000, function(){
  console.log('Server On!');
});
