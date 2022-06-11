const mysql = require('mysql');
const parse = require('csv-parse');
const fs = require('fs');

//SQL
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

function syncQuery(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, res) => {
            if(err) reject(err);
            else resolve(res);
        })
    })
}

function defCallback(err, res) {
    //if(err) console.log(err);
    //else console.log(res);
}

//Use official DB
con.query("USE official", defCallback);

//Drop pre-existing table & add new one
syncQuery("DROP TABLE IF EXISTS zodiac").then(
syncQuery(`CREATE TABLE zodiac(
    id INT NOT NULL AUTO_INCREMENT, 
    date DATE NOT NULL, 
    sun INT NOT NULL, 
    moon INT NOT NULL, 
    mercury INT NOT NULL,
    venus INT NOT NULL, 
    mars INT NOT NULL,
    jupiter INT NOT NULL,
    saturn INT NOT NULL,
    uranus INT NOT NULL,
    neptune INT NOT NULL,
    pluto INT NOT NULL,
    PRIMARY KEY(id))`));
//CSV

//Iterate through all CSV files
var CSVs = fs.readdirSync('./data');

//Pop raw
CSVs.pop();

CSVs.forEach((fileName, index, CSVs) => {
    var parser = parse.parse({ delimiter: ',' });
    var records = [];

    parser.on('readable', () => {
        var record;
        while((record = parser.read()) != null) {
            records.push(record);
        }
    })

    parser.on('end', () => {
        //Remove first entry
        records.shift();

        //Retrieve data
        var data = "";
        records.forEach((record) => {
            data = data + "(\"" + record[0] + "\"," + record[1] + "," + record[2] + "," + record[3] + "," + record[4] + "," + record[5] + "," + record[6] + "," + record[7] + "," + record[8] + "," + record[9] + "," + record[10] + "),";
        });

        //Get rid of last comma and replace with semicolon
        data = data.slice(0,-1) + ';';

        //Send query
        con.query("INSERT INTO zodiac (date, sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto) VALUES " + data);

        console.log(index)
        
        //console.log(records);
        records = [];
        if(index == CSVs.length - 1) {
            con.end();
        }
    })

    var file = fs.readFileSync(`./data/${fileName}`);
    parser.write(file);
    parser.end();
})
