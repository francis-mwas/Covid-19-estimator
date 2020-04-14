import express from "express";
import CovidController from "../controllers/covidController";
const router = express.Router();

router.post("/", CovidController.createData);
router.post("/region", CovidController.addRegionData);
router.get("/logs", CovidController.getLogs);
router.post("/:format", CovidController.getCovidData);
router.post("/", CovidController.getCovidData);
router.post("/json", CovidController.getCovidData);

export default router;
