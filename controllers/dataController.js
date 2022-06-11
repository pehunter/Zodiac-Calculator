const mysql = require('mysql');
const url = require('url');

//Setup DB connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

//Connect
con.connect((err) => {
    if(err) console.log(err);
    else console.log("Connected to database");
});

//Wraps query in promise so functions can wait for response
function syncQuery(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, res) => {
            if(err) reject(err);
            else resolve(res);
        })
    })
}

//Default callback for queries
function defCallback(err, res) {
    if(err) console.log(err);
    //else console.log(res);
}

//Use official DB as working DB
con.query("USE official", defCallback);

//Get number corresponding to sign
function getZValue(sign, name) {
    switch(sign) {
        case "Aries": return 0;
        case "Taurus": return 1;
        case "Gemini": return 2;
        case "Cancer": return 3;
        case "Leo": return 4;
        case "Virgo": return 5;
        case "Libra": return 6;
        case "Scorpio": return 7;
        case "Sagittarius": return 8;
        case "Capricorn": return 9;
        case "Aquarius": return 10;
        case "Pisces": return 11;
        default: return name;
    }
}

//Load the results page with proper data
async function loadResults(req, res) {
    //Parse response
    console.log(req.url);
    const params = url.parse(req.url, true).query;
    console.log(params);

    //Form request
    // Note: Moon OR statement is there because the moon's sign might've changed during the day
    var request = `SELECT * FROM zodiac WHERE 
    sun = ${getZValue(params.sun, "sun")} AND 
    (moon = ${getZValue(params.moon, "moon") == 0 ? 11 : getZValue(params.moon, "moon") - 1} OR
    moon = ${getZValue(params.moon, "moon")}) AND
    mercury = ${getZValue(params.mercury, "mercury")} AND
    venus = ${getZValue(params.venus, "venus")} AND
    mars = ${getZValue(params.mars, "mars")} AND
    jupiter = ${getZValue(params.jupiter, "jupiter")} AND
    saturn = ${getZValue(params.saturn, "saturn")} AND
    uranus = ${getZValue(params.uranus, "uranus")} AND
    neptune = ${getZValue(params.neptune, "neptune")} AND
    pluto = ${getZValue(params.pluto, "pluto")};`;
    
    console.log(request);

    var data = await syncQuery(request);

    console.log(data);

    //Load results with data
    res.render("results", {data: data, sun: getZValue(params.sun, 0),rising: getZValue(params.rising, 0)});
}

module.exports = {
    loadResults
};