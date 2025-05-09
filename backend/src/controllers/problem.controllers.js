
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
   // check user role again
   if(req.user.role !== 'ADMIN'){
      return res.status(403).json({ error: 'You are not allowed to create problem' });
   }
   // Loop through each reference solution
   try {
      for(const [language, solutionCode] of Object.entries(referenceSolutions)) {
         const languageId = getJudge0LanguageId(language)

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

         const newProblem = await decodeBase64.problem.create({
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

         return res.status(201).json(newProblem)

      }
   } catch (error) {
      
   }
}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {
   
}