// const morgan = require("morgan");

// morgan.token("response-time", () => {
//   let start = new Date();
//   let end = new Datae() * 0.5;
//   let timeDiff = start - end;
//   timeDiff = Math.round(timeDiff); // Removing decimals
//   timeDiff = timeDiff.toString().padStart(2, 0); // ensuring u have atleast two digits
//   timeDiff = +timeDiff; // converting back to integer

//   return timeDiff;
// });

// const morgan = require("morgan");
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "logs/access.log"),
//   { flags: "a" }
// );
// app.use(
//   morgan(":method\t\t:url\t\t:status\t\t0:total-time[0]ms", {
//     stream: accessLogStream
//   })
// );

/////////////////////////
// let covidData = {
//   periodType: "days",
//   timeToElapse: "38",
//   reportedCases: "2747",
//   totalHospitalBeds: "678874",
//   population: "92931687",
//   region: {
//     avgAge: "19.7",
//     name: "Africa",
//     avgDailyIncomeInUSD: "4",
//     avgDailyIncomePopulation: "0.73"
//   }
// };

// let newObject = {};

// const c19Data = await Covid.find();

// const otherData = c19Data.map(data1 => data1);
// otherData.forEach(data2 => {
//   newObject = data2;
// });

// const {
//   periodType,
//   timeToElapse,
//   reportedCases,
//   totalHospitalBeds,
//   population,
//   region
// } = covidData;

// const {
//   name,
//   avgDailyIncomeInUSD,
//   avgDailyIncomePopulation,
//   avgAge
// } = covidData.region;
