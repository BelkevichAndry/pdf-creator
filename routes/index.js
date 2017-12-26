const routes = require('express').Router();
const mysql = require('mysql');
const fs = require('fs');

const html_pdf = require('html-pdf');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "pdfgen"
});

    let img;
    let base64image;
    let firstName;
    let lastName;

routes.get('/user/:name', function(req, res) {
  let user = req.params.name;
  
  if(res.headersSent) { }
    else {
       res.setHeader('Content-Type', 'application/json');
   } 
  
  con.query("SELECT * FROM user WHERE lastName ='"+user+"';", function (err, result, fields) {
    if (err) {
       return res.send(JSON.stringify({ result: false }))
     }

     if(result.length == 0){
        return res.send(JSON.stringify({ result: false }))
     } else {

     img = result[0].image
     base64image = img.toString('base64');
     firstName = result[0].firstName;
     lastName = result[0].lastName;
    }

    let html = "<p>"+firstName +" "+lastName +"<p> <img src='data:image/png;base64," + base64image + "'/>"; 

  html_pdf.create(html).toBuffer(function(err, buffer){
    var sql = "UPDATE user SET pdf = ? WHERE lastName ='"+user+"';";

    con.query(sql, buffer, function (err, result) {
      if (err) {
         return  res.send(JSON.stringify({ result: false }))
        } else {
            return res.send(JSON.stringify({ result: true }))
           };
      });
    })
  })
});


module.exports = routes;
