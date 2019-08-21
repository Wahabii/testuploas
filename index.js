
const Joi = require('joi');
//build a web server 
var express = require('express');
var app = express();

const fs = require("fs");
const multer= require('multer');


 const storage = multer.diskStorage({

 destination:function(req, file, cb){
    cb(null, '.uploads/');

 },


filename:function(req,file,cb){
 
    cb(null, new Date().toISOString() +fille.originalname);


     
}

 });

 const upload = multer({storage: storage});
const bodyParser = require('body-parser');


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//connected to mongodb
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true } )
.then(() => console.log('login success.. '))
.catch((err)=> console.log(err));

//define the sheape 
const courseschema=mongoose.Schema({

     name:String,
    //author:String,
    //tags:[ String],
    //date:{type: Date, default: Date.now},
    //isPublished: Boolean,
    price:Number,
    img: { data: Buffer, contentType: String }
});
const Course = mongoose.model('Cours', courseschema);
/*
 //filter Document
 async function getCourses(){

  return await Course.find({})
    .sort({name: -1})
    .select({name:1, tags:1 , _id:0});
}


async function run(){

const course= await getCourses();
console.log(course);

}
run();

*/


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
   
// add new course



app.post('/api/courses',upload.single('image'),(req, res, next ) => {
   
       /* 
       const { error }= ValidateCourse(req.body);
         if(error)
         return res.status(400).send(error.details[0].message);
         */
       console.log(req.file);
       
       const course= new  Course({
        name: req.body.name,
       //tags:  req.body.tags,
       //author: req.body.author,
      // isPublished : req.body.isPublished,
       price: req.body.price,
       img: req.form-data
       });
     
        course.save().then((course)=> {
         res.send(course);
       }).catch((errors)=>{
           console.log(errors);
       });
   
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
          
       };
   
   
       return Joi.validate(cours,schema);
   }
   


app.listen(4000, () => console.log(`listening on porte 4000.....` ));