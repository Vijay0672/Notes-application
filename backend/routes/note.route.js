import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  searchNote,
  updateNotePinned,
} from "../controller/note.controller.js"

const router = express.Router()

// router.post("/add", verifyToken, addNote)
// router.post("/edit/:noteId", verifyToken, editNote)
// router.get("/all", verifyToken, getAllNotes)
// router.delete("/delete/:noteId", verifyToken, deleteNote)
// router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned)
// router.get("/search", verifyToken, searchNote)
router.get("/all", verifyToken, getAllNotes)
router.post("/add", verifyToken, addNote)
router.post("/edit/:id", verifyToken, editNote)
router.delete("/delete/:id", verifyToken, deleteNote)
router.put("/update-note-pinned/:id", verifyToken, updateNotePinned)
router.get("/search", verifyToken, searchNote)

export default router
