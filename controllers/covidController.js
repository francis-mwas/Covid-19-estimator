import fs from "fs";
import path from "path";
import Covid from "../model/covidModel";
const jsonxml = require("jsontoxml");

let data = {
  periodType: "days",
  timeToElapse: "38",
  reportedCases: "2747",
  totalHospitalBeds: "678874",
  population: "92931687",
  region: {
    avgAge: "19.7",
    name: "Africa",
    avgDailyIncomeInUSD: "4",
    avgDailyIncomePopulation: "0.73"
  }
};
export default class CovidController {
  static async addRegionData(req, res) {
    const {
      dataId,
      avgAge,
      name,
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    } = req.body;

    const dataToAddRegion = await Covid.findById(dataId);
    const region = {
      avgAge,
      name,
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    };
    dataToAddRegion.region.unshift(region);
    dataToAddRegion.save();

    return res.status(200).json({
      status: "Success",
      message: "Region data added successfully"
    });
  }

  static async createData(req, res) {
    const format = req.params.format;

    const {
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population
    } = req.body;
    const {
      avgAge,
      name,
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    } = req.body.region;

    const covidData = {
      region: req.body.region,
      ...req.body
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

    console.log("This is the converted data:", convert());

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
    const data = {
      data: covidData,
      estimate: {
        impact,
        severeImpact
      }
    };

    const stringifyData = JSON.stringify(data);

    if (format === "json") {
      res.contentType("application/json");
      return res.status(200).send(data);
    }

    if (format === "xml") {
      res.contentType("application/xml");
      return res.status(200).send(jsonxml(stringifyData, { xmlHeader: true }));
    }

    return res.status(200).json({
      data: covidData,
      impact,
      severeImpact
    });
  }

  static async getCovidData(req, res) {
    const format = req.params.format;

    const {
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population
    } = req.body;
    const {
      avgAge,
      name,
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    } = req.body.region;

    const covidData = {
      region: req.body.region,
      ...req.body
    };

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

    console.log("This is the converted data:", convert());

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
    const data = {
      data: covidData,
      impact,
      severeImpact
    };

    const stringifyData = JSON.stringify(data);

    if (format === "json") {
      res.contentType("application/json");
      return res.status(200).send(data);
    }

    if (format === "xml") {
      res.contentType("application/xml");
      return res.status(200).send(jsonxml(stringifyData, { xmlHeader: true }));
    }

    return res.status(200).json({
      data: covidData,
      impact,
      severeImpact
    });
  }

  static async getLogs(req, res) {
    try {
      var data = fs.readFileSync(path.join(__dirname, "../logs/access.log"), {
        flags: "a"
      });

      res.contentType("text/plain");
      res.status(200).send(data);
    } catch (e) {
      console.log("Error:", e.stack);
    }
  }
}

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "logs/access.log"),
//   { flags: "a" }
// );

// fs.readFileSync("../logs/access.log", "utf8");
