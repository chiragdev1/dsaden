import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
   getAllSubmissionsByUser,
   getAllSubmissionsForProblem,
   getSubmissionsForProblemByUser,
} from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.get(
   "/get-all-submissions",
   authenticateUser,
   getAllSubmissionsByUser
);
submissionRoutes.get(
   "/get-submissions/:problemId",
   authenticateUser,
   getSubmissionsForProblemByUser
);

submissionRoutes.get(
   "/get-submission-count/:problemId",
   authenticateUser,
   getAllSubmissionsForProblem
);

export default submissionRoutes;
