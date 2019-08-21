//call module
var express = require('express');
var app = express();
var path = require('path')
var multer = require('multer')
//var upload = multer({dest: './uploads'})
//var routes = require('./routes/index')
const bodyParser= require('body-parser')
//var port = process.env.PORT|| 3000;

// Multer path define
var storage = multer.diskStorage({
	destination: './uploads',
	filename: function(req,file,cb){
		cb(null,file.fieldname + '_' + Date.now() +path.extname(file.originalname) );
	}
});
// init upload

var upload = multer({
	storage: storage
});


app.use(bodyParser.urlencoded({extended: true}))

//app.set('view engine','ejs');

//connect Mongodb
const MongoClient = require('mongodb').MongoClient
var db
MongoClient.connect('mongodb://localhost/playground', { useNewUrlParser: true } , (err, client) => {
  if (err) return console.log(err)
  db = client.db('Cours') // whatever your database name is
  app.listen(5000, () => {
    console.log('listening on 5000')
  })
})

//routes
app.get('/', (req,res)=>{
	res.render('index')
})
app.post('/api/courses',  upload.single('post_iamge'), (req,res)=>{
	
	  db.collection('posts').save(req.body, (err, result) => {
    if (err) return console.log(err)

    
  console.log(req.file);
  
  const course= new  Course({
  name: req.body.name,
  //tags:  req.body.tags,
  //author: req.body.author,
 // isPublished : req.body.isPublished,
  price: req.body.price,
  imageUrl: req.body.imageUrl
  });

   course.save().then((course)=> {
    res.send(course);
  }).catch((errors)=>{
      console.log(errors);
  });
    
	
    
  })
	  
})

app.get('/blog',(req,res)=>{
	  db.collection('posts').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('blog',{posts: result})
  })
})