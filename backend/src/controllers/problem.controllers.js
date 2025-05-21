import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
   // Get all the required fields from the request body 
   const {
      title,
      description,
      difficulty,
      constraints,
      tags,
      examples,
      testcases,
      referenceSolutions,
      codeSnippets,
   } = req.body;

   console.log('Retrived data from req.body')

   // check user role again
   if(req.user.role !== 'ADMIN'){
      return res.status(403).json({ error: 'You are not allowed to create problem' });
   }
   // Loop through each reference solution
   try {
      for(const [language, solutionCode] of Object.entries(referenceSolutions)) {
         const languageId = getJudge0LanguageId(language);

         if(!languageId) {
            return res.status(400).json({error: `Language ${language} is not supported!`})
         }

         const submissions = testcases.map(( {input, output} ) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output
         }))

         const submissionResults = await submitBatch(submissions)

         // Getting tokens from first call to judge0
         const tokens = submissionResults.map( (res) => res.token)

         // Create a submission batch
         const results = await pollBatchResults(tokens)

         for(let i=0; i<results.length; i++) {
            const result = results[i]

            if(result.status.id !== 3) {
               return res.status(400).json({error: `Testcase ${i + 1} failed for language ${language}`})
            }
         }
      }

      console.log('Creating new problem in db')
      const newProblem = await db.problem.create({
         data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            referenceSolutions,
            codeSnippets,
            userId: req.user.id,
         },
      })
      console.log("new problem created successfully: ", newProblem)

      
      return res.status(201).json({
         success: true,
         message: 'Problem created successfully',
         problem: newProblem,
      })

   } catch (error) {
      console.log('Error looping through reference solutions, Error: ',error )

      res.send(401).json({
         success: false,
         message: "Error looping through reference solutions",
      });
   }
}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {
   
}

export const getAllProblemsSolvedByUser = async (req, res) => {}