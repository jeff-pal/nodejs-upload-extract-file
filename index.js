const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const extract = require('extract-zip')
const app = express();
var fs = require('fs');

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//start app 
const port = process.env.PORT || 3000;

app.post('/upload-avatar', async (req, res) => {

    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let files = req.files;
            console.log(req.files.test)
            let data = [];
            for (let key in files) {
                files[key].mv('./uploads/' + files[key].name);
                console.log('ok')


                try {
                    await extract('./uploads/' + files[key].name, { dir: __dirname + '/uploads/result' });
                    await fs.unlink('./uploads/' + files[key].name, function (err) {
                        if (err) throw err;
                        // if no error, file has been deleted successfully
                        console.log('File deleted!');
                    });
                    console.log('Extraction complete')
                } catch (err) { console.log(err) }

                data.push({ name: files[key].name, mimetype: files[key].mimetype, size: files[key].size });
            }



            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            // avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);
