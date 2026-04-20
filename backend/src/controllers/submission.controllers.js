import { db } from "../libs/db.js";

export const getAllSubmissionsByUser = async (req, res) => {
   try {
      const userId = req.user.id;

      const submissions = await db.submission.findMany({
         where: { userId },
      });

      res.status(200).json({
         success: true,
         message: "Submissions fetched successfully!",
         submissions,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         error: `Failed to fetch submissions`,
      });
   }
};

export const getSubmissionsForProblemByUser = async (req, res) => {
   try {
      const { problemId } = req.params;
      const userId = req.user.id;

      const submissions = await db.submission.findMany({
         where: { userId, problemId },
      });

      res.status(200).json({
         success: true,
         message: "Submissions fetched successfully!",
         submissions,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         error: `Failed to fetch submissions`,
      });
   }
};

export const getAllSubmissionsForProblem = async (req, res) => {
   try {
      const { problemId } = req.params;

      const submissionCount = await db.submission.count({
         where: { problemId },
      });

      res.status(200).json({
         success: true,
         message: "Submission count fetched successfully!",
         submissionCount,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         error: `Failed to fetch submission count`,
      });
   }
};
