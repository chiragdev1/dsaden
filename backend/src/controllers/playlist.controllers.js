import { db } from "../libs/db.js";


export const getAllPlaylists = async (req, res) => {
   try {
      const userId = req.user.userId
      const playlists = await db.playlist.findMany({
         where: {userId},
         include: {
            problems: {
               include: {
                  problem: true
               }
            }
         }
      })

      res.status(200).json({
         success: true,
         message: "All playlists fetched successfully!",
         playlists
      })
   } catch (error) {
      console.log("Failed in getAllPlaylist------", error)
      res.status(500).json({
         error: "Failed to fetch playlists"
      })
   }
}

export const getPlaylistById = async (req, res) => {
   try {
      const {playlistId} = req.params
      const userId = req.user.userId

      const playlist = await db.playlist.findUnique({
         where: {
            id: playlistId, 
            userId 
         }, include:  {
            problems: {
               include: {
                  problem: true
               }
            }
         }
      })

      res.status(200).json({
         success: true,
         message: "Playlist fetched successfully!",
         playlist
      })
   } catch (error) {
      console.log("Failed at getPlaylistById", error)
      res.status(500).json({
         error: "Failed to fetch playlist"
      })
   }
}

export const createPlaylist = async (req, res) => {
   try {
      // get {name, description}
      const {name, description} = req.body
      const userId = req.user.id

      if(!name) {
         return res.status(400).json({
            error: "Invalid name"
         })
      }

      const playlist = await db.playlist.create({
         data: {
            name,
            description,
            userId
         }
      })

      res.status(201).json({
         success: true,
         message: "Playlist created successfully!",
         playlist
      })
   } catch (error) {
      console.log("Failed at createPlaylist", error)
      res.status(500).json({
         error: "Failed to create playlist"
      })
   }
}

export const addProblemsToPlaylist = async (req, res) => {
   try {
      const {playlistId} = req.params
      const {problemIds} = req.body
      if(!Array.isArray(problemIds) || problemIds.length === 0) {
         return res.status(400).json({
            success: false,
            error: "Invalid/missing problemIds"
         })
      }

      const problems = problemIds.map( problemId => ({playlistId, problemId}))

      const problemInPlaylist =await db.problemInPlaylist.createMany({
         data: problems,
      });

      res.status(201).json({
         success: true,
         message: "Problems added to playlist",
         problemInPlaylist
      })
   } catch (error) {
      console.log("Failed at addProblemToPlaylist-------", error)
      res.status(500).json({error: "Failed to add problem to playlist"})
   }
}

export const deletePlaylistById = async (req, res) => {
   try {
      // get playlist id from params
      const { playlistId } = req.params;

      // make db call to delete playlist
      const deletedPlaylist = await db.playlist.delete({
         where: {
            id: playlistId,
         },
      });

      // success message
      res.status(200).json({
         success: true,
         message: "Deleted playlist succesfully!",
      });
   } catch (error) {
      console.log("Failed at deletePlaylist", error)
      res.status(500).json({error: "Failed to delete playlist"})
   }
}

export const deleteProblemsFromPlaylist = async (req, res) => {
   try {
      const {playlistId} = req.params
      const {problemIds} = req.body

      if(!Array.isArray(problemIds) || problemIds.length === 0) {
         return res.status(400).json({error: "Invalid or missing problemIds"})
      }

      const deletedProblems = await db.problemInPlaylist.deleteMany({
         where: {
            playlistId,
            problemId: {
               in: problemIds
            }
         }
      })

      res.status(200).json({
         success: true,
         message: "Problems deleted successfully from playlist"
      })
   } catch (error) {
      console.log("Failed at deleteProblemFromPlaylist", error)
      res.status(500).json({error: "Failed to delete problems from playlist"})
   }
}
