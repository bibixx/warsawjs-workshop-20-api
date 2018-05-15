const fs = require("fs");

const airports = require("./airports.json");
const airlines = require("./airlines.json");

/* ------------------ */
const N = +process.env.RECORDS;

const PRICE_MIN = 500;
const PRICE_MAX = 1000;

const DATE_MAX = 1000;

const MAX_TRANSFERS = 2;

const START_DATE = [2018, 4, 10]
const MAX_DAYS_IN_FUTURE = 7;
/* ------------------ */

const usedFlights = {};

const to2dig = i => String(i).padStart(2, "0");
const formatDate = d => `${d.getFullYear()}-${to2dig(d.getMonth() + 1)}-${to2dig(d.getDate())}`;
const rand = (min = 1, max, floor = true) => {
  const random = Math.random() * (max - min) + min; 

  return floor ? Math.floor(random) : random;
}

const createFlight = (startHour, airportFrom, airportTo) => {
  const length = Math.floor(rand(0.5, 23 - startHour, false) * 10) / 10

  return {
    startHour,
    length,
    airportFrom,
    airportTo,
    airline: airlines[rand(0, airlines.length)].id
  }
}

const getRandomWithout = (arr, str = "") => {
  const newArr = arr.filter(v => v !== str);

  return newArr[rand(0, newArr.length)];
}

const createPath = (airportFrom, airportTo) => {
  const to = [];
  const startHour = rand(0, 23);
  const transfers = rand(0, MAX_TRANSFERS);
  let transfersUsed = 0;
  const airportsUsed = [airportFrom, airportTo];

  const availableAirports = airports.map(v => v.code).filter(v => airportsUsed.indexOf(v) < 0);

  let newFlight = { startHour, length: 0 };
  let lastDestination = airportFrom;
  while (newFlight.startHour + newFlight.length < 23.9 && transfersUsed <= transfers) {
    const randomAirport1 = lastDestination;
    const randomAirport2 = getRandomWithout(availableAirports);
    lastDestination = randomAirport2;

    newFlight = createFlight(newFlight.startHour + newFlight.length, randomAirport1, randomAirport2);
    to.push(newFlight);
    availableAirports.push(randomAirport2);
    transfersUsed++
  }

  to[to.length-1].airportTo = airportTo;

  return to;
}

const generate = (outboundDate, inboundDate, outboundAirport, inboundAirport) => {
  const n = rand(1, 10);
  const fetchName = [outboundDate, inboundDate, outboundAirport, inboundAirport].join("/");
  const wasCreated = usedFlights[fetchName] !== undefined;

  if ( !wasCreated ) {
    const flights = 
      Array(n).fill({})
      .map((f, i) => {
        const id = rand(0, 100000) + i;
        const price = rand(PRICE_MIN, PRICE_MAX);
        
        // const outboundDate = new Date(new Date(...START_DATE).getTime() + rand(1, 7) * 24 * 60 * 60 * 1000);
        // const inboundDate = new Date(outboundDate.getTime() + rand(1, MAX_DAYS_IN_FUTURE) * 24 * 60 * 60 * 1000);
  
        // const outboundAirport = getRandomWithout(airports).code;
        // const inboundAirport = getRandomWithout(airports, outboundAirport).code;
  
        const outboundPath = createPath(outboundAirport, inboundAirport);
        const inboundPath = createPath(inboundAirport, outboundAirport);
  
        return {
          id,
          price,
          outboundPath,
          inboundPath,
          outboundDate,
          inboundDate,
          outboundAirport,
          inboundAirport
        }
      })
  

    usedFlights[fetchName] = flights;
    return flights;
  }

  return usedFlights[fetchName];
}

module.exports = generate;