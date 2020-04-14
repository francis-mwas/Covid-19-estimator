import express from "express";
import CovidController from "../controllers/covidController";
const router = express.Router();

router.post("/", CovidController.createData);
router.post("/region", CovidController.addRegionData);
router.get("/logs", CovidController.getLogs);
router.get("/:format", CovidController.getCovidData);
router.get("/", CovidController.getCovidData);
router.get("/json", CovidController.getCovidData);

export default router;
