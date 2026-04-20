import express from 'express'

import { authenticateUser } from '../middlewares/auth.middleware.js'
import { addProblemsToPlaylist, createPlaylist, deletePlaylistById, deleteProblemsFromPlaylist, getAllPlaylists, getPlaylistById } from '../controllers/playlist.controllers.js'

const playlistRoutes = express.Router()

playlistRoutes.get('/',authenticateUser, getAllPlaylists)
playlistRoutes.get("/:playlistId", authenticateUser, getPlaylistById)

playlistRoutes.post("/create-playlist", authenticateUser, createPlaylist)
playlistRoutes.post("/:playlistId/add-problems", authenticateUser, addProblemsToPlaylist)

playlistRoutes.delete("/:playlistId", authenticateUser, deletePlaylistById)
playlistRoutes.delete("/:playlistId/delete-problems", authenticateUser, deleteProblemsFromPlaylist)

export default playlistRoutes