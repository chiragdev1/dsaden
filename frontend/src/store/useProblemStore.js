import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
   problems: [],
   problem: null,
   solvedProblems: [],
   isFetchingProblems: false,
   isFetchingProblem: false,
   isFetchingSolvedProblems: false,

   getAllProblems: async () => {
      try {
         set({ isFetchingProblems: true });

         const res = await axiosInstance.get("/problems/get-all-problems");
         set({ problems: res.data.problems });
      } catch (error) {
         console.log("Error fetching problems", error);
         toast.error("Error fetching problems");
      } finally {
         set({ isFetchingProblems: false });
      }
   },

   getProblemById: async (id) => {
      try {
         set({ isFetchingProblem: true });

         const res = await axiosInstance.get(`/problems/get-problem/${id}`);

         set({ problem: res.data.problem });
         toast.success("Problem fetched successfully");
      } catch (error) {
         console.log("Error fetching problem", error);

         toast.error("Error fetching problem");
      } finally {
         set({ isFetchingProblem: false });
      }
   },

   getSolvedProblemsByUser: async () => {
      try {
         set({ isFetchingSolvedProblems: true });
         const res = await axiosInstance.get("/problems/get-solved-problems");
      } catch (error) {
         console.log("Error fetching solved problems", error);
         toast.error("Error fetching solved problems");
      } finally {
         set({ isFetchingSolvedProblems: false });
      }
   },
}));
