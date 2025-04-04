import express from "express";
import {
  getOffices,
  createOffice,
  updateOffice,
  deleteOffice
} from "../controllers/officeController.js";

const router = express.Router();

router.get("/", getOffices);
router.post("/", createOffice);
router.put("/:officeId", updateOffice);
router.delete("/:officeId", deleteOffice);

export default router;
