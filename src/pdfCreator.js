const PDFDocument = require('pdfkit');

const fs = require('fs');
const dateTime = require('node-datetime');
const path = require('path');
const { defaultCoreCipherList } = require('constants');

function generateReport ({first_name,last_name,gender,age}={} , prediction)
{
  var dateAndTime = dateTime.create();
  var date = dateAndTime.format('d-m-Y');
  var time = dateAndTime.format('H:M:S');
  const pdfName = first_name + '_' + last_name  + '_'+ 'X-Ray.pdf';
  const pdfPath = path.join(__dirname , '../public/Reports' , pdfName);
  
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.fontSize(35).text('New Diagnostic Centre', 100, 80, {
    align: 'center'
  });
  doc.fontSize(13).text('Digital X-Ray || MRI || Sonography || lab', {
    align: 'center'
  });
  doc.fontSize(10).text('------------------------------------------------------------------------------------------------------------------------------------');
  doc.fontSize(10).text('------------------------------------------------------------------------------------------------------------------------------------');
  doc.moveDown(2);
  doc.fontSize(18).text('Patient Information', {
    align: 'center'
  });
  doc.moveDown(1);
  doc.fontSize(13).list([`Patient Name : ${first_name} ${last_name}` , `Age : ${age}` , `Gender : ${gender}` , `Study Date : ${date}`, `Study time : ${time}`] , {
    align: 'left',
    bulletRadius: 2
  });
  doc.moveDown(1);
  doc.fontSize(10).text('------------------------------------------------------------------------------------------------------------------------------------');
  doc.moveDown(2);
  doc.fontSize(18).text('Diagnosis Of Pneumonia', {
    align: 'center'
  });
  doc.moveDown(1);
  doc.fontSize(13).text('Technique Used : Detection using Machine Learning on chest X-Ray.');
  doc.moveDown(1);
  doc.fontSize(13).text(`Diagnosis Result : ${prediction}`);
  doc.moveDown(1);
  doc.image('../public/img/sign.jpeg', 440, 430, { fit: [100,100] , align: "centre"});
  doc.moveDown(0.3);
  doc.fontSize(13).text('Dr. Doctors Name', 435, 510);
  doc.moveDown(1);
  doc.fontSize(10).text('------------------------------------------------------------------------------------------------------------------------------------',100);
  doc.fontSize(10).text('------------------------------------------------------------------------------------------------------------------------------------',100);
  doc.moveDown(1);
  doc.fontSize(13).text('Our Address :Mahalaxmi Vihar, Survey No 44 Shop No 83 Alandi Road, Near Bank Of Maharashtra Vishrantwadi, Pune - 411015');
  doc.fontSize(13).text('Call us : 9999999999 , 8888888888 ' , {
    align: "centre"
  });
  doc.end();
}



module.exports = { generateReport };