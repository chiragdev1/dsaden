import axios from "axios"

export const getJudge0LanguageId = (language) => {
   const languageMap = {
      'JAVASCRIPT': 63,
      'PYTHON': 71,
      'JAVA': 62,
   }
   
   return languageMap[language.toUpperCase()]
}

const sleep = (time) => new Promise( (resolve, reject) => setTimeout(resolve, time))


export const pollBatchResults = async (tokens) => {
   while(true) {
      const {data} = await axios.get(`${JUDGE0_API_URL}/submissions/batch`, {
         params: {
            tokens: tokens.join(', '),
            base64_encoded: false,

         }
      })

      const results = data.submissions

      const areAllDone = results.every(
         (r) => r.status.id !== 1 && r.status.id !== 2
      )

      if(areAllDone) return results
      await sleep(1000) // wait for 1 second before trying again
   }
}


export const submitBatch = async (submissions) => {
   const { data } = await axios.post(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
         submissions
      }
   );

   console.log('Submission results: ', data)
   return data // Array of tokens [ {token}, {token}, {token}]
}
