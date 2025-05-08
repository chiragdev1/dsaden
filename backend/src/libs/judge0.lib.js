import axios from "axios"

export const getJudge0LanguageId = (language) => {
   const languageMap = {
      'JAVASCRIPT': 63,
      'PYTHON': 71,
      'JAVA': 62,
   }
   
   return languageMap[language.toUpperCase()]
}

export const submitBatch = async (submissions) => {
   const { data } = await axios.post(`${process.env.JUDGE0_API_URL}`);
}