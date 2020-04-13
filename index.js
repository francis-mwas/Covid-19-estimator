function convert(periodType) {
  let toDays = 0;
  switch (periodType) {
    case "days":
      toDays = data.timeToElapse;
      console.log("This will be in days");
      break;
    case "weeks":
      toDays = data.timeToElapse * 7;
      console.log("This will be in weeks");

      break;
    case "months":
      toDays = data.timeToElapse * 30;
      console.log(`This will be in months`);
      break;

    default:
      toDays = data.timeToElapse;
      console.log("This will be defaulted to days");
  }

  return toDays;
}

function factor() {
  let toDays = 0;
  if (data.periodType === "days") {
    toDays = data.timeToElapse;
  } else if (data.periodType === "weeks") {
    toDays = data.timeToElapse * 7;
  } else if (data.periodType === "months") {
    toDays = data.timeToElapse * 30;
  }

  return Math.trunc(toDays / 3);
}

function convert() {
  let toDays = 0;
  if (data.periodType === "days") {
    console.log("we have the days", data.timeToElapse);
    toDays = data.timeToElapse;
  } else if (data.periodType === "weeks") {
    console.log("we have the weeks", data.timeToElapse);
    toDays = data.timeToElapse * 7;
  } else if (data.periodType === "months") {
    console.log("we have the months", data.timeToElapse);
    toDays = data.timeToElapse * 30;
  }

  return toDays;
}

module.exports = covid19ImpactEstimator = (data) => {
  const { reportedCases, totalHospitalBeds, region } = data;

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
      region.avgDailyIncomeInUSD *
      region.avgDailyIncomePopulation) /
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
    seInfeByRequestedTime *
    region.avgDailyIncomePopulation *
    region.avgDailyIncomeInUSD;

  const output = Math.trunc(seDInFlight / convert());

  //  covid impact
  const impact = {
    currentlyInfected: impInfectionsByRequestedTime,
    infectionsByRequestedTime: impInfectionsByRequestedTime,
    severeCasesByRequestedTime: impseCasesByRequestedTime,
    hospitalBedsByRequestedTime: impHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: impCasesForIcu,
    casesForVentilatorsByRequestedTime: impCasesForVentilators,
    dollarsInFlight: impDInFlight,
  };

  // severe impact
  const severeImpact = {
    currentlyInfected: severeCurInfected,
    infectionsByRequestedTime: seInfeByRequestedTime,
    severeCasesByRequestedTime: seCasesByRequestedTime,
    hospitalBedsByRequestedTime: seHospitalBedsByRequestedTime,
    casesForICUByRequestedTime: seCasesForIcu,
    casesForVentilatorsByRequestedTime: seCasesForVentilators,
    dollarsInFlight: output,
  };

  return {
    data,
    impact,
    severeImpact,
  };
};

data = {
  region: {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73,
  },
  periodType: "days",
  timeToElapse: 38,
  reportedCases: 2747,
  population: 92931687,
  totalHospitalBeds: 678874,
};
