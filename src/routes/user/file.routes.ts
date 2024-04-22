import express from "express";
import { preUpload } from "../../controller/user/pre-upload.controller";
import { preDownload } from "../../controller/user/pre-download.controller";
import verifyJWT from "../../middlewares/verifyJwt";
import { addFileLog, deleteFileLogs, getAllFileLogs, getFileLog } from "../../controller/user/upload.controller";
//router initailzed

const router = express.Router();
router.use(verifyJWT)
//different routes
router.route("/pre-upload").post(preUpload);
router.route("/pre-download").post(preDownload);
router.route("/add-file-log").post(addFileLog);
router.route("/delete-file-log/:fileId").delete(deleteFileLogs);
router.route("/all-file-log").get(getAllFileLogs);
router.route("/file-log/:fileId").get(getFileLog);
//export
export default router