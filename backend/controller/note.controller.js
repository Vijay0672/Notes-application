import Note from "../models/note.model.js"
import { errorHandler } from "../utils/error.js"

export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body

  const { id } = req.user

  if (!title) {
    return next(errorHandler(400, "Title is required"))
  }

  if (!content) {
    return next(errorHandler(400, "Content is required"))
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: id,
    })

    await note.save()

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}

export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.id)

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }

  if (req.user.id !== note.userId) {
    return next(errorHandler(401, "You can only update your own note!"))
  }

  const { title, content, tags, isPinned } = req.body

  if (!title && !content && !tags) {
    return next(errorHandler(404, "No changes provided"))
  }

  try {
    if (title) {
      note.title = title
    }

    if (content) {
      note.content = content
    }

    if (tags) {
      note.tags = tags
    }

    if (isPinned) {
      note.isPinned = isPinned
    }

    await note.save()

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllNotes = async (req, res, next) => {
  const userId = req.user.id

  try {
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 })

    res.status(200).json({
      success: true,
      message: "All notes retrived successfully",
      notes,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNote = async (req, res, next) => {
  const noteId = req.params.id; // ✅ fixed

  const note = await Note.findOne({ _id: noteId, userId: req.user.id });

  if (!note) {
    return next(errorHandler(404, "Note not found"));
  }

  try {
    await Note.deleteOne({ _id: noteId, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const updateNotePinned = async (req, res, next) => {
  try {
    const noteId = req.params.id; // ✅ fixed
    const note = await Note.findById(noteId);

    if (!note) {
      return next(errorHandler(404, "Note not found!"));
    }

    if (req.user.id !== note.userId.toString()) {
      // note.userId might be ObjectId — convert to string
      return next(errorHandler(401, "You can only update your own note!"));
    }

    const { isPinned } = req.body;
    note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Pin status updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};


export const searchNote = async (req, res, next) => {
  try {
    const { query } = req.query;
    const userId = req.user?.id;

    console.log("🔍 Search query:", query);
    console.log("👤 User ID:", userId);

    if (!userId) {
      return next(errorHandler(401, "Unauthorized user! Please log in again."));
    }

    if (!query || query.trim() === "") {
      return next(errorHandler(400, "Search query is required"));
    }

    // Use case-insensitive regex ($options: "i") to match titles, content, or tags
    const matchingNotes = await Note.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).sort({ isPinned: -1, createdAt: -1 }); // optional sorting

    console.log(`📄 Found ${matchingNotes.length} matching notes`);

    if (matchingNotes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notes found matching your search.",
        notes: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notes matching your search retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    console.error("❌ Error while searching notes:", error.message);
    next(error);
  }
};
