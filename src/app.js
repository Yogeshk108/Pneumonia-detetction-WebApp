const express = require('express');
const multer = require('multer');
const path  = require('path');
const request = require('postman-request');
const hbs = require('hbs');
const fs = require('fs')
const ReportCreator = require('../src/pdfCreator');
const email = require('../src/email');

const viewpath = path.join(__dirname , '../templets/views');
const partialspath = path.join(__dirname , '../templets/partials')

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public'));
app.set('view engine' , 'hbs');
app.set('views' , viewpath);
hbs.registerPartials(partialspath);

var storage = multer.diskStorage ({
    destination: function (req, file, cb) {
      cb(null, '../public/uploads/')
    },
    filename: function (req, file, cb) {
      var img_name = req.body.first_name + "_" + req.body.last_name + "_" + file.originalname
      cb(null, img_name)
    }
  })

var upload = multer({ storage: storage })
const PORT = process.env.PORT || 3000;

app.get('', function(req, res) {
  res.render('index');
})

app.post('/home', upload.single('image') ,function (req, res) {

    console.log(req.body , '\n');
    console.log(req.file);
    
    var MyURL = 'http://127.0.0.1:5000/predict?name=' + req.file.filename;
    
    request( MyURL , (err , response, body) => {
      if(err) {
        console.log('ERROR : ' , err);
        res.render('index');
      }
      else {
        console.log('\nBody : ', body);

        ReportCreator.generateReport(req.body, body);
        
        const pdfName = req.body.first_name + '_' + req.body.last_name  + '_'+ 'X-Ray.pdf';
        const imgName = req.body.first_name + "_" + req.body.last_name + "_" + req.file.originalname;

        if(req.body.report == "yes") {
          setTimeout( () => { email.sendEmail(pdfName , req.body.email) } , 2.0*1000 );
        }
        res.render('new' , {
          pdfName : pdfName,
          prediction : body,
          imgName : imgName
        });
      }
    })
});

app.get('/help' , (req,res) => {
  res.render('help')
});

app.get('/about' , (req,res) => {
  res.render('about')
});

app.get('/Precaution' , (req,res) => {
  res.render('precaution')
});

app.get('*', (req,res) => {
  res.render('404', {
      title: '404',
      errormessage: 'Page not found'
  })
})

app.listen(PORT, function (){ 
    console.log('Listening on Port 3000');
});