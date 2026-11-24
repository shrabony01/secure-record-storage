import express from "express";
import {Note} from "../../models/index.js";
import { authMiddleware } from "../../utils/auth.js";

const router = express.Router();

// Apply authMiddleware to all routes in this file

router.use (authMiddleware);

//Get ONLY notes owned by the currently logged-in user
router.get("/",async(req,res)=>{
    try{
        const notes = await Note.find({user: req.user._id});
        res.json(notes);
    } catch(err){
        res.status(500).json(err);
    }

});
//GET /api/notes/:id - Get a single note
router.get("/:id",async(req,res)=>{
    try{
        const note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).json({ message: "No note found with this id!" });
        }
        if(note.user.toString() !== req.user._id){
            return res
                .status(403)
                .json({ message: "User is not authorized to view this note." });
        }

        res.json(note);
    }catch(err){
        res.status(500).json(err);
    }
});
// POST /api/notes - Create a new note associated with the logged-in user
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});
// PUT /api/notes/:id - Update a note ONLY if owned by the logged-in user
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    // Check if the logged-in user owns this note
    if (note.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to update this note." });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json(err);
  }
});
// DELETE /api/notes/:id - Delete a note ONLY if owned by the logged-in user
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "No note found with this id!" });
    }

    // Check if the logged-in user owns this note
    if (note.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "User is not authorized to delete this note." });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});
export default router;