
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
         
      }
   } catch (error) {
      
   }
}

export const getAllProblems = async (req, res) => {}

export const getProblemById = async (req, res) => {}

export const updateProblem = async (req, res) => {}

export const deleteProblem = async (req, res) => {
   
}