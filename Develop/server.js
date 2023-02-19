const express = require('express');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid')

const PORT = 3000;

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html']
}));

app.get('/notes', (req, res) => {
    res.render("notes.html")
})


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error occurred: ${err}`)
            res.send("Errored Occurred")
        } else {
            const db = JSON.parse(data)
            res.json(db);
        }
    })
});

app.post('/api/notes', (req, res) => {
    let bodyData = req.body;
    bodyData.id = nanoid(10)

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error occurred: ${err}`)
            res.send("Errored Occurred")
        } else {
            const db = JSON.parse(data)
            db.push(bodyData);

            fs.writeFile('./db/db.json', JSON.stringify(db), function(err) {
                if (err) {
                    throw err
                } else {
                    console.log('Saved Data')
                }
            });
        }
    })
    res.end();
})

app.delete('/api/notes/:id', (req, res) => {

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error occurred: ${err}`)
            res.send("Errored Occurred")
        } else {
            const db = JSON.parse(data)
            const filterArray = db.filter((item) => item.id !== req.params.id)

            fs.writeFile('./db/db.json', JSON.stringify(filterArray), function(err) {
                if (err) {
                    throw err
                } else {
                    console.log('Updated Data')
                }
            });
        }
    })
    res.end();
})

app.get("*", (req, res) => {
    res.render('index.html');
});

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});

