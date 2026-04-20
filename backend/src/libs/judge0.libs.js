import axios from "axios";

export const getJudge0LanguageId = (language) => {
   // console.log('inside getLanguageId')
   const languageMap = {
      "JAVASCRIPT": 63,
      "JAVA": 62,
      "PYTHON": 71,
   }
   return languageMap[language.toUpperCase()]
}

export const getJudge0LanguageName = (languageId) => {
   const LANGUAGE_NAMES = {
      62: "JAVA",
      63: "JAVASCRIPT",
      71: "PYTHON",
      74: "TYPESCRIPT",

   }
}

export const submitBatch = async (submissions) => {
   // console.log("Inside submitBatch")
   

   // Make a POST request to Judge0 API to submit batch of submissions

   const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
         base64_encoded: "false",
      },
      headers: {
         "x-rapidapi-key": "c380377c68msh410acc059693df2p11d546jsn873e4486dcc3",
         "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
         "Content-Type": "application/json",
      },
      data: {
         submissions: submissions
      },
   };

   let response
   try {
       response = await axios.request(options);
      // console.log("Response.data by submitBatch",response.data);
   } catch (error) {
      console.error("actch error in submitBatch",error);
   }

   // submissions should be an array of objects with language_id, source_code, stdin, expected_output
   // console.log("submissions Results",response.data)
   // Return the response from Judge0 API
   return response.data
}

const sleep = (ms) => new Promise( (resolve) => setTimeout(resolve,ms))

// export const pollBatchResults = async (tokens) => {
//    console.log("inside pollBatchResults")

   

//    // Make a GET request to Judge0 API to poll the results of the batch submissions
//    while(true) {

//       const res = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
//          params: {
//             tokens: tokens.join(",")
//          },
//          headers: {
//             "x-rapidapi-key": "c380377c68msh410acc059693df2p11d546jsn873e4486dcc3",
//             "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//          },
         
//       })
//       // const options = {
//       //    method: "GET",
//       //    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
//       //    params: {
//       //       tokens:tokens.join(","),
//       //       base64_encoded: "false",
//       //       fields: "*",
//       //    },
//       //    headers: {
//       //       "x-rapidapi-key":
//       //          "c380377c68msh410acc059693df2p11d546jsn873e4486dcc3",
//       //       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//       //    },
//       // };

//       try {
//          const res = await axios.request(options);
//          console.log(response.data);
//       } catch (error) {
//          console.error(error);
//       }

//       const results = res.data.submissions

//       const isAllDone = results.every( (r) => r.status.id !== 1 && r.status.id !== 2)

//       if(isAllDone) return results

//       await sleep(1000)

//    }

//    // tokens should be an array of submission tokens returned from submitBatch
//    // Return the results from Judge0 API
// }

export const pollBatchResults = async (tokens) => {
   // console.log("inside pollBatchResults");
   // console.log("tokens", tokens)
   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

   while (true) {
      let response;
      try {
         response = await axios.get(
            "https://judge0-ce.p.rapidapi.com/submissions/batch",
            {
               params: {
                  tokens: tokens.join(","),
                  base64_encoded: "false",
               },
               headers: {
                  "x-rapidapi-key":
                     "c380377c68msh410acc059693df2p11d546jsn873e4486dcc3",
                  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
               },
            }
         );

         // console.log("pollBatch axios response:", response.data.submissions.status);
      } catch (error) {
         console.error("Polling error:", error.response?.data || error.message);
         break;
      }

      const results = response.data.submissions;
      // console.log("response.data.submissions", response.data.submissions);

      const isAllDone = results.every(
         (r) => r.status.id !== 1 && r.status.id !== 2
      );

      if (isAllDone) return results;

      await sleep(500);
   }
};
