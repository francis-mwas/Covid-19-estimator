import mongoose from "mongoose";
const covidDataSchema = new mongoose.Schema({
  region: {
    name: {
      type: String
    },
    avgAge: {
      type: String
    },
    avgDailyIncomeInUSD: {
      type: String
    },
    avgDailyIncomePopulation: {
      type: String
    }
  },
  periodType: {
    type: String
  },
  timeToElapse: {
    type: String
  },
  reportedCases: {
    type: String
  },
  population: {
    type: String
  },
  totalHospitalBeds: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("covid", covidDataSchema);
