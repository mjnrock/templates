import express from "express";
import fs from "fs";

const APP = express();
const PORT = 3001;

/**
 * This is a newer way to do the work commonly seen with `bodyParser`
 */
APP.use(express.urlencoded({ extended: true }));
APP.use(express.json());
APP.use(express.raw());

/**
 * This activates CORS
 */
APP.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //? Whatever middleware work .next() is doing is ESSENTIAL to actually making this work
    next();
});

/**
 * A sample GET request that reads the /data/messages.json file and sends it back as a response
 */
APP.get("/feed", (req, res) => {
    // "/feed/:feedId"
    // req.params.feedId
    fs.readFile("./data/messages.json", function (err, buff) {
        return res.send(buff.toString());
    });
});

/**
 * A sample POST request that will open the /data/messages.json file, append a new message, save and close the file, and return a 200 response code (i.e. "OK")
 */
APP.post("/message/", (req, res) => {
    const filepath = "./data/messages.json";
    const message = req.body;

    // console.log(message);

    fs.readFile(filepath, "utf8", (err, data) => {
        if(err) {
            console.log(err);
        } else {
            let obj = JSON.parse(data);
            obj.push(message);

            let json = JSON.stringify(obj);
            fs.writeFile(filepath, json, () => {
                res.sendStatus(200);
            });
        }
    });
});

/**
 * This causes the `express` library to invoke a server on port=@PORT, with a console.log callback
 */
APP.listen(PORT, () =>
    console.log(`Example app listening on port ${PORT}!`),
);