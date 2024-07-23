const express=require('express');
const path=require('path');
const fs=require('fs');

const app =express();
app.use((req,res,next)=>{
 console.log(req.originalUrl)
 next();
})
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
 fs.readdir(`./files`,function(err,files){
  res.render("index",{files:files})
 })
 
})
//app.post('/create',(req,res)=>{
//fs.writeFile(`./files/${req.body.title.split('').join('')}.txt`,req.body.details,(err)=>{
 //res.redirect("/")
//})
//})
app.post('/create', (req, res) => {
  if (!req.body.title || !req.body.details) {
    return res.status(400).send('Title and details are required');
  }
  const filename = req.body.title.split(' ').join('_') + '.txt';
  fs.writeFile(`./files/${filename}`, req.body.details, (err) => {
    if (err) {
      return res.status(500).send('Error creating file');
    }
    res.redirect("/");
  });
});


app.get('/files/:filename',(req,res)=>{
 fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
   res.render('show',{filename:req.params.filename , filedata:filedata})
 })
})

app.get('/edit/:filename',(req,res)=>{
  res.render('edit',{filename:req.params.filename})
})

app.post('/edit',(req,res)=>{
  fs.rename(`./files/${req.body.previous}`,`./files/${req.body.newName}`,(err)=>{
    res.redirect("/")
  })
})
app.listen(4000,()=>{
 console.log("created")
});