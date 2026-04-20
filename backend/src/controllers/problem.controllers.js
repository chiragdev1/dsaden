import { db } from "../libs/db.js";
import {
   getJudge0LanguageId,
   pollBatchResults,
   submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
   console.log("inside createProblem Controller");

   // get data from body
   const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolution,
   } = req.body;

   // validate the data
   if (
      !title ||
      !description ||
      !difficulty ||
      !tags ||
      !examples ||
      !constraints ||
      !testcases ||
      !codeSnippets ||
      !referenceSolution
   ) {
      console.log("Response sent for missing data");
      return res.status(400).json({
         success: false,
         message: "All fields are required",
      });
   }

   // check user role again
   if (req.user.role !== "ADMIN") {
      console.log(
         "response sent for not admin inside createProblem controller"
      );
      // console.log("req.user.role = ", req.user.role);
      return res.status(403).json({
         success: false,
         message: "User not authorized to create problem",
      });
   }

   // trycatch
   try {
      // Loop through the referenceSolutions and extract [language, solutionCode] from Object.entries

      for (const [language, solutionCode] of Object.entries(
         referenceSolution
      )) {
         // get languageId from method
         const languageId = getJudge0LanguageId(language);

         if (!languageId) {
            console.log("Response sent for languageId");
            return res.status(400).json({
               success: false,
               message: "Language not supported!",
            });
         }

         // Array of submisssions for each language
         // loop through the testcases and get input, output from them
         const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
         }));

         if (!submissions || submissions.length === 0) {
            console.log("Response sent for empty submissions");
            return res.status(400).json({
               success: false,
               message: "No submissions found",
            });
         }

         // Make the first call to judge0 with language_id, source_code, stdin, expected_output using submitBatch
         const submissionResults = await submitBatch(submissions);

         if (!submissionResults || submissionResults.length === 0) {
            console.log("Response sent for empty submissionResults");
            return res.status(400).json({
               success: false,
               message: "No submission results found",
            });
         }
         const tokens = submissionResults.map((res) => res.token);

         if (!tokens || tokens.length === 0) {
            console.log("Response sent for empty tokens");
            return res.status(400).json({
               success: false,
               message: "No tokens found",
            });
         }

         // execute polling using the tokens from submitBatch
         const results = await pollBatchResults(tokens);
         // console.log("result from pollBatchResults", results)
         // Loop through the results to check for a failed test case

         const failedTest = results.find((r) => r.status.id !== 3);
         if (failedTest) {
            console.log("Response sent for failedTest", failedTest);
            return res.status(400).json({
               message: `Testcase failed for language ${language}`,
               status: failedTest.status,
            });
         }
         // for (let i = 0; i < results.length; i++) {
         //    const result = results[i];

         //    if (result.status.id !== 3) {
         //       return res.status(400).json({
         //          message: `error: Testcase ${
         //             i + 1
         //          } failed for language ${language}`,
         //       });
         //    }
         // }
      }

      const newProblem = await db.problem.create({
         data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testCases: testcases,
            codeSnippets,
            referenceSolution,
            userId: req.user.id,
         },
      });
      console.log("newProblem", newProblem);
      if (!newProblem) {
         return res.status(500).json({
            success: false,
            message: "Problem not created",
         });
      }

      res.status(201).json({
         success: true,
         message: "Problem created successfully",
         problem: newProblem,
      });
   } catch (error) {
      console.error("Error in createProblem:", error);
      res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};

export const getAllProblems = async (req, res) => {
   // trycatch
   try {
      // get all the problems from db
      const problems = await db.problem.findMany({
         include: {
            solvedProblems: {
               where: {
                  userId: req.user.id
               }
            }
         }
      });

      if (!problems) {
         return res.status(404).json({
            success: false,
            error: `No problem found`,
         });
      }
      // success message
      res.status(200).json({
         success: true,
         message: "Problems fetched successfully",
         problems,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         error: `Error while fetching problems`,
      });
   }
};

export const getProblemById = async (req, res) => {
   const { id } = req.params;

   if (!id) {
      return res.status(404).json({
         success: false,
         error: "Invalid ProblemId",
      });
   }

   try {
      const problem = await db.problem.findUnique({ where: { id } });

      if (!problem) {
         return res.status(404).json({
            error: "Problem not found",
         });
      }

      res.status(200).json({
         success: true,
         message: "problem fetched successfully",
         problem,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         error: "Error while fetching problem by id",
      });
   }
};

export const updateProblemById = async (req, res) => {
   // get id
   const { id } = req.params;
   const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolution,
   } = req.body;

   // check if problem exist for this id
   try {
      const problem = await db.problem.findUnique({ where: { id } });

      if (!problem) {
         return res.status(404).json({
            success: false,
            error: "Problem not found for id",
         });
      }
   } catch (error) {}
   // baki same as create
   // use db.problem.update
};

export const deleteProblemById = async (req, res) => {
   const { id } = req.params;

   try {
      const problem = await db.problem.findUnique({ where: { id } });

      if (!problem) {
         return res.status(404).json({ error: "Problem not found" });
      }

      await db.problem.delete({ where: { id } });

      res.status(200).json({
         success: true,
         message: "Problem deleted successfully",
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         error: "Error while deleting problem",
      });
   }
};

export const getSolvedProblemsByUser = async (req, res) => {
   try {
      const userId = req.user.id;
      const solvedProblems = await db.problem.findMany({
         where: {
            solvedProblems: {
               some: { userId },
            },
         },
         include: {
            solvedProblems: {
               where: { userId },
            },
         },
      });

      res.status(200).json({
         success: true,
         message: "All solvedProblems fetched successfully",
         solvedProblems
      })
   } catch (error) {
      console.log("error in getSolvedProblemsByUser--------", error)
      res.status(500).json({
         error: "Failed to fetch the solvedProblems"
      })
   }
};
