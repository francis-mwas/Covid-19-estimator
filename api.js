const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use(
  morgan("tiny", {
    stream: fs.createWriteStream("./logs.txt", { flags: "a" })
  })
);

app.get("/api/v1/on-covid-19/logs", (req, res) => {
  var fs = require("fs");

  try {
    var data = fs.readFileSync("./logs.txt", "utf8");
    res.contentType("text/plain");
    res.status(200).send(data);
  } catch (e) {
    console.log("Error:", e.stack);
  }
});

app.post("/api/v1/on-covid-19", (req, res) => {
  const {
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds
  } = req.body;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = req.body.region;

  const data = {
    ...req.body,
    ...req.body.region
  };

  function factor() {
    let toDays = 0;
    if (periodType === "days") {
      toDays = timeToElapse;
    } else if (periodType === "weeks") {
      toDays = timeToElapse * 7;
    } else if (periodType === "months") {
      toDays = timeToElapse * 30;
    }

    return Math.trunc(toDays / 3);
  }

  function convert() {
    let toDays = 0;
    if (periodType === "days") {
      console.log("we have the days", timeToElapse);
      toDays = timeToElapse;
    } else if (periodType === "weeks") {
      console.log("we have the weeks", timeToElapse);
      toDays = timeToElapse * 7;
    } else if (periodType === "months") {
      console.log("we have the months", timeToElapse);
      toDays = timeToElapse * 30;
    }

    return toDays;
  }

  // code for impact
  const impCurrentlyInfected = reportedCases * 10;
  const impInfectionsByRequestedTime = impCurrentlyInfected * 2 ** factor();
  const impseCasesByRequestedTime = Math.trunc(
    impInfectionsByRequestedTime * 0.15
  );
  const impHospitalBedsByRequestedTime = Math.trunc(
    totalHospitalBeds * 0.35 - impseCasesByRequestedTime
  );
  const impCasesForIcu = 0.05 * impInfectionsByRequestedTime;
  const impCasesForVentilators = Math.trunc(
    0.02 * impInfectionsByRequestedTime
  );
  const impDInFlight = Math.trunc(
    (impInfectionsByRequestedTime *
      avgDailyIncomeInUSD *
      avgDailyIncomePopulation) /
      convert()
  );

  const severeCurInfected = reportedCases * 50;
  const seInfeByRequestedTime = severeCurInfected * 2 ** factor();
  const seCasesByRequestedTime = Math.trunc(seInfeByRequestedTime * 0.15);
  const seHospitalBedsByRequestedTime = Math.trunc(
    totalHospitalBeds * 0.35 - seCasesByRequestedTime
  );
  const seCasesForIcu = 0.05 * seInfeByRequestedTime;
  const seCasesForVentilators = Math.trunc(0.02 * seInfeByRequestedTime);
  const seDInFlight =
    seInfeByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD;

  const output = Math.trunc(seDInFlight / convert());

  //  covid impact
  const impact = {
    currentlyInfected: impInfectionsByRequestedTime,
    infectionsByRequestedTime: impInfectionsByRequestedTime,
    severeCasesByRequestedTime: impseCasesByRequestedTime,
    hospitalBedsByRequestedTime: impHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: impCasesForIcu,
    casesForVentilatorsByRequestedTime: impCasesForVentilators,
    dollarsInFlight: impDInFlight
  };

  // severe impact
  const severeImpact = {
    currentlyInfected: severeCurInfected,
    infectionsByRequestedTime: seInfeByRequestedTime,
    severeCasesByRequestedTime: seCasesByRequestedTime,
    hospitalBedsByRequestedTime: seHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: seCasesForIcu,
    casesForVentilatorsByRequestedTime: seCasesForVentilators,
    dollarsInFlight: output
  };

  const covidData = {
    data,
    impact,
    severeImpact
  };

  return res.status(200).json({
    status: "success",
    message: "Data returned successfully",
    covidData
  });
});

app.listen(port, () => {
  console.log(`App up and running on port: ${port}`);
});
