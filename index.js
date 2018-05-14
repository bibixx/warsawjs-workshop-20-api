const airports = require("./airports.json");
const airlines = require("./airlines.json");
const flights = require("./flights.json");

const path = require("path");
const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile( path.join(__dirname + '/index.html') );
});

app.get('/ping', (req, res) => {
  res.json({pong: true})
});

app.get('/flights/:outboundDate/:inboundDate/:outboundAirport/:inboundAirport', (req, res) => {
  const {outboundDate, inboundDate, outboundAirport, inboundAirport} = req.params;

  const f = flights.filter(f =>
    f.outboundDate === outboundDate &&
    f.inboundDate === inboundDate &&
    f.outboundAirport === outboundAirport &&
    f.inboundAirport === inboundAirport
  );
  res.json(f)
});

app.get('/airports', (req, res) => {
  res.json(airports)
});

app.get('/airports/:code', (req, res) => {
  res.json(airports.find(a => a.code === req.params.code))
});

app.get('/airlines', (req, res) => {
  res.json(airlines)
});

app.get('/airlines/:id', (req, res) => {
  res.json(airlines.find(a => a.id === +req.params.id))
});

app.use("/assets", express.static(path.join(__dirname + '/public')))

app.listen(process.env.PORT, () => console.log(`API listening on port ${process.env.PORT}!`))