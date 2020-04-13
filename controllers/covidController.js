import fs from "fs";
import Covid from "../model/covidModel";
const jsonxml = require("jsontoxml");

const covid19Data = {
  region: {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73
  },
  periodType: "days",
  timeToElapse: 38,
  reportedCases: 2747,
  population: 92931687,
  totalHospitalBeds: 678874
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
    const {
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population
    } = req.body;

    const newCovidData = new Covid({
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population
    });

    try {
      const covid = await newCovidData.save();
      res.status(201).json({
        status: true,
        Message: "New Data successfully added",
        covid
      });
    } catch (error) {
      if (error) {
        return res.status(400).json({
          status: false,
          Message: `An error occured while saving the product: ${error}`
        });
      }
    }
  }

  static async getCovidData(req, res) {
    const format = req.params.format;
    // const avgDailyIncomePopulation = regionData[0].avgDailyIncomePopulation;
    // const avgDailyIncomeInUSD = regionData[0].avgDailyIncomeInUSD;

    const {
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population
    } = covid19Data;

    const {
      name,
      avgAge,
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    } = covid19Data.region;

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
      covid19Data,
      impact,
      severeImpact
    };

    const stringifyData = JSON.stringify(covidData);

    if (format === "json") {
      res.contentType("application/json");
      return res.status(200).send(covidData);
    }

    if (format === "xml") {
      res.contentType("application/xml");
      return res.status(200).send(jsonxml(stringifyData, { xmlHeader: true }));
    }

    return res.status(200).json({
      status: "success",
      message: "Data returned successfully",
      covidData
    });
  }

  static async getLogs(req, res) {
    try {
      var data = fs.readFileSync("./logs.txt", "utf8");
      res.contentType("text/plain");
      res.status(200).send(data);
    } catch (e) {
      console.log("Error:", e.stack);
    }
  }
}
