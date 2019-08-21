const Joi = require('joi');
const multer=require('multer');
const mongoose=require('mongoose');
//const upload =multer({dest:'uploads/'});

//file
const bodyParser = require('body-parser');
const path=require('path');
const fs = require('fs');
//generate the files names 
const crypto=require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodeOverride = require('method-override');

//build a web server 
var express = require('express');
var app = express();
app.use(express.json());

//middleware

app.use(bodyParser.json());
app.use(methodeOverride('_method'));

// mongo URI
 const mongoURI = 'mongodb://localhost/playground';

//create mongo connection 
const conn = mongoose.createConnection(mongoURI);

//init gfs 
conn.once('open', ()=> {
//init stream
 gfs = Grid(conn.db, mongoose.mongo);
 gfs.collection('uploads');
});


//connected to mongodb
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true } )
.then(() => console.log('login success.. '))
.catch((err)=> console.log(err));


//define the sheape 
const courseschema=mongoose.Schema({

    name:String,
    author:String,
    tags:[ String],
    date:{type: Date, default: Date.now},
    isPublished: Boolean,
    price:Number,
    imageURL:{type: String}
});
const Course = mongoose.model('Cours', courseschema);

// index of API 
app.get('/',(req,res) => {
    res.send('hello REST API work !!!!');
});

//get all courses 
app.get('/api/courses', (req,res) => {
    Course.find({}).then( (courses) => {
        res.send(courses);
    }).catch((errors) => {
    res.send(errors);
    }
    );   
});
   
// get course by id 
app.get('/api/courses/:id', (req,res) => {
    const id = req.params.id;
    Course.findOne({_id: id }).then( (courses) => {
        res.send(courses);
    }).catch((errors) => {
    res.send(errors);
    }
    );      
});
   


//create storage engine 

const storage = new GridFsStorage({
    url: mongoURI,
    name: req.body.name,
    tags:  req.body.tags,
    author: req.body.author,
    isPublished : req.body.isPublished,
    price: req.body.price,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// add neew course
app.post('/api/courses', upload.single('myimage'),(req,res) => {
   /*
       const { error }= ValidateCourse(req.body);
         if(error)
         return res.status(400).send(error.details[0].message);
       
       const course= new  Course({
       name: req.body.name,
       tags:  req.body.tags,
       author: req.body.author,
       isPublished : req.body.isPublished,
       price: req.body.price,
       myimage:req.file
       });
       
        course.save().then((course)=> {
         res.send(course);
       }).catch((errors)=>{
           console.log(errors);
       });
   */
   
   res.json({file:req.file});


   });




   //update course by  id 
   app.put('/api/courses/:id', (req,res) => {
       //validate
      //if not valide return 400 bad requist
    const { error }= ValidateCourse(req.body);
    if(error)
    return res.status(400).send(error.details[0].message);
    
    const id = req.params.id;
    Course.findOne({_id: id }).then( (course) => {
        course.set("name",req.body.name);
        course.set("author",req.body.author);
        course.set("date",req.body.date);
        course.set("tags",req.body.tags);
        course.set("price",req.body.price);
        course.save();
        res.send(course);
    }).catch((errors) => {
    res.send(errors);
    }
    );  
   });
   
   
   app.delete('/api/courses/:id', (req,res) => {
    
    const id = req.params.id;
    Course.findOne({_id: id }).then( (course) => {
        course.delete();
        res.send({message:"course have been deleted successfuly"});
    }).catch((errors) => {
    res.send(errors);
    }
    );  
   });
   

   function ValidateCourse(cours){
   
    const schema = {
        name:Joi.string().min(3).required(),
        author:Joi.string(),
        tags:Joi.array().items(Joi.string()),
        isPublished: Joi.boolean(),
        price: Joi.number(),
         myimage:Joi.string()
       
    }; 


    return Joi.validate(cours,schema);
}


   app.listen(8000, () => console.log(`listening on porte 6000.....` ));
   
   
   
   