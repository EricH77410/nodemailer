const express       = require('express');
const bodyParser    = require('body-parser');
const handleBar     = require('express-handlebars');
const nodemailer    = require('nodemailer');
const path          = require('path');

const app = express();

app.engine('handlebars', handleBar())
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const data = {
        name: 'CS Web Service',
        addr: '4 rue F. Pelloutier',
        tel: '01 64 80 85 45',
        mail: 'infoline@csdental.com'
    }
    res.render('contact', data);
});

app.post('/contact', (req, res) => {
    const output = `
        <p>Voici un nouveau contact</p>
        <h3>Details</h3>
        <ul>
            <li>Nom : ${req.body.name}</li>
            <li>Société : ${req.body.company}</li>
            <li>Email : ${req.body.email}</li>
            <li>Tel : ${req.body.phone}</li>
        </ul>
        <h3>Message :</h3>
        <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.sfr.fr',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'rico@club-internet.fr', // generated ethereal user
            pass: '' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Carestream Dental" <infoline@csdental.com>', // sender address
        to: 'rico@club.fr', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello world', // plain text body
        html: output//'<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
            res.render('contact', {msg: 'Erreur envoi email'})
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.render('contact', {msg: 'Email envoyé !'})
    });


});

app.listen(3102, () => console.log('Server running ...'));