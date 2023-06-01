import express from "express";
import {GetAll, Create, Update, Delete} from "../controller/Controllers.js"

const router = express.Router();

 // @route - /api/v1/bootcamps/
router.route("/").get(GetAll).post(Create)

 // @route - /api/v1/bootcamps/id
router.route("/:id").put(Update).delete(Delete)

export default router;