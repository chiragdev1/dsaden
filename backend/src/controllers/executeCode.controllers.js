import {
   getJudge0LanguageName,
   pollBatchResults,
   submitBatch,
} from "../libs/judge0.libs.js";
import { db } from "../libs/db.js";

export const executeCode = async (req, res) => {
   // extract userId from req.user
   const userId = req.user.id;

   // extract {source_code, language_id, stdin, expected_outputs, problemId}
   const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

   // validate testcases stdin isArray and length, expected_output isArray and length === stdin.length (400, invalid or missing testcases)
   if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
   ) {
      console.log("stdin", stdin);
      return res.status(400).json({ error: "invalid or missing testcases" });
   }

   try {
      // prepare each testcase for judge0 batch submissions
      const submissions = stdin.map((input) => ({
         source_code,
         language_id,
         stdin: input,
      }));

      // send batch of submission
      const submitBatchResults = await submitBatch(submissions);
      console.log("submitBatchResults--------- ", submitBatchResults);

      const tokens = submitBatchResults.map((res) => res.token);

      // poll judge0 for submissions
      const results = await pollBatchResults(tokens);

      // console.log("Results from pollBatchResults----------", results)

      // Analyze testcase results
      let allPassed = true;

      const detailedResults = results.map((result, i) => {
         const stdout = result.stdout.trim();
         const expectedOutput = result.stdout.trim();
         const passed = stdout === expectedOutput;

         if (!passed) allPassed = false;

         return {
            testCase: i + 1,
            passed,
            stdout,
            expected: expectedOutput,
            stderr: result.csttderr || null,
            compile_output: result.compile_output || null,
            status: result.status.description,
            memory: result.memory ? `${result.memory} KB` : undefined,
            time: result.time ? `${result.time} s` : undefined,
         };
      });

      console.log("detailedResults---------", detailedResults);

      // store submission
      const submission = await db.submission.create({
         data: {
            userId,
            problemId,
            source_code,
            language_id: JSON.stringify(language_id),
            stdin: stdin.join("\n"),
            stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
            stderr: detailedResults.some((r) => r.stderr)
               ? JSON.stringify(detailedResults.map((r) => r.stderr))
               : null,
            compileOutput: detailedResults.some((r) => r.compile_output)
               ? JSON.stringify(detailedResults.map((r) => r.compile_output))
               : null,
            status: allPassed ? "Accepted" : "Wrong Answer",
            memory: detailedResults.some((r) => r.memory)
               ? JSON.stringify(detailedResults.map((r) => r.memory))
               : null,
            time: detailedResults.some((r) => r.time)
               ? JSON.stringify(detailedResults.map((r) => r.time))
               : null,
         },
      });

      // If allPassed, mark the problem as solved for current user
      if (allPassed) {
         await db.solvedProblem.upsert({
            where: {
               userId_problemId: { userId, problemId },
            },
            update: {},
            create: { userId, problemId },
         });
      }

      // Save individual testcase results using detailedResults
      const testcaseResults = detailedResults.map((res) => ({
         submissionId: submission.id,
         testcase: res.testCase,
         passed: res.passed,
         stdout: res.stdout,
         expected_output: res.expected,
         compileOutput: res.compile_output,
         status: res.status,
         memory: res.memory,
         time: res.time,
      }));

      // create testCaseResult for each of these results
      await db.testCaseResult.createMany({
         data: testcaseResults,
      });

      //
      const submissionWithTestCase = await db.submission.findUnique({
         where: { id: submission.id },
         include: { testCaseResults: true },
      });

      res.status(200).json({
         success: true,
         message: "Code executed successfully",
         submission: submissionWithTestCase
      });
   } catch (error) {
      console.log("Error in executeCode Controller", error);
      return res.status(500).json({
         success: false,
         error: "Failed to execute code",
      });
   }
};
