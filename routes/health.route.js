import express from "express"

import { checkHealth } from "../controllers/health.controller.js"

const route = express.Router();
router.get("/",checkHealth)

export default router;