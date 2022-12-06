const express = require('express');
const cors = require('cors')
const { body, validationResult } = require('express-validator');
const http = require('http');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
const server = http.createServer(app);
const jsonParser = bodyParser.json()
const setTZ = require('set-tz');
// var cron = require('node-cron');

const { PDFDocument } = require("pdf-lib");
const { writeFileSync } = require("fs");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
/**==============================================================
 * FUNCTION TIME START
 ===============================================================*/
 setTZ('Asia/Makassar');
 let timestamp = new Date().getTime();
 let new_date = new Date();
 let realtime = date("%Y%m%d%H%M%S");
 function date(fstr) {
   let date = new Date();
   return fstr.replace (/%[YmdHMS]/g, function (m) {
     switch (m) {
     case '%Y': return date['getFullYear'] ();
     case '%m': m = 1 + date['getMonth'] (); break;
     case '%d': m = date['getDate'] (); break;
     case '%H': m = date['getHours'] (); break;
     case '%M': m = date['getMinutes'] (); break;
     case '%S': m = date['getSeconds'] (); break;
     default: return m.slice (1);
     }
     return ('0' + m).slice (-2);
   });
 }
 /* date("%Y-%m-%d %H:%M:%S")
  returns "2012-05-18 05:37:21" */
 //  setInterval(cek,1000);
 //  function cek(){
 //     console.log(date("%d-%m-%Y %H:%M:%S"));
 //  }
 /**==============================================================
  * FUNCTION TIME END
  ===============================================================*/

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload({
  debug: false
}));

// =================================================================
app.get('/', (req, res) => {
    res.sendFile('page.html', {
      root: __dirname
    });
  });
// =================================================================
// =================================================================
app.post("/pdf-info", jsonParser, [
    body('url').notEmpty(),
  ], async (req, res) => {
    const url = req.body.url;
    if(url=='kill'){
        process.exit();
    }else{
           try {
             const existingPdfBytes = await fetch(url).then(resp => resp.arrayBuffer());

                const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
                updateMetadata: false 
                });
                
                // console.log('Title:', pdfDoc.getTitle());
                // console.log('Author:', pdfDoc.getAuthor());
                // console.log('Subject:', pdfDoc.getSubject());
                // console.log('Creator:', pdfDoc.getCreator());
                // console.log('Keywords:', pdfDoc.getKeywords());
                // console.log('Producer:', pdfDoc.getProducer());
                // console.log('Creation Date:', pdfDoc.getCreationDate());
                // console.log('Modification Date:', pdfDoc.getModificationDate());
                // console.log('Page Count:', pdfDoc.getPageCount());

                res.status(200).json({
                    Code : 200,
                    Title:pdfDoc.getTitle(),
                    Author:pdfDoc.getAuthor(),
                    Subject: pdfDoc.getSubject(),
                    Creator: pdfDoc.getCreator(),
                    Keywords: pdfDoc.getKeywords(),
                    Producer: pdfDoc.getProducer(),
                    CreationDate: pdfDoc.getCreationDate(),
                    ModificationDate: pdfDoc.getModificationDate(),
                    PageCount: pdfDoc.getPageCount()
                });
           } catch (e) {
            // console.log('Bad Request [ 400 ]')
            res.status(400).json('Bad Request [ 400 ]');
           }
        
        }
  
       
  });
  // =================================================================
// **********************************
server.listen(port, function() {
    console.log('App running on Port : ' + port);
  });
// **********************************