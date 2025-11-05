import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import { signInFailure } from "../../redux/user/userSlice";

// ✅ optional: set baseURL once for convenience
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // ✅ Fetch all notes (handles 401 automatically)
  const getAllNotes = async () => {
    try {
      const res = await axios.get("/api/note/all");

      if (res.data.success === false) {
        console.log("getAllNotes returned:", res.data);
        toast.error(res.data.message || "Failed to fetch notes");
        return;
      }

      setAllNotes(res.data.notes || []);
    } catch (err) {
      console.error("getAllNotes error:", err.response?.status, err.response?.data);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        dispatch(signInFailure("Unauthorized"));
        navigate("/login");
      } else {
        toast.error(err.message);
      }
    }
  };

  // ✅ Watch currentUser and fetch notes only when logged in
  useEffect(() => {
    console.log("currentUser (Home):", currentUser);

    if (!currentUser) {
      navigate("/login");
      return;
    }

    // handle different shapes (depending on backend response)
    setUserInfo(currentUser?.user ?? currentUser?.rest ?? currentUser);
    getAllNotes();
  }, [currentUser, navigate]);

  // ✅ Handle add or edit note
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const deleteNote = async (note) => {
    try {
      const res = await axios.delete(`/api/note/delete/${note._id}`);

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      console.error("deleteNote error:", error);
      toast.error(error.message);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("/api/note/search", { params: { query } });

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      setIsSearch(true);
      setAllNotes(res.data.notes || []);
    } catch (error) {
      console.error("onSearchNote error:", error);
      toast.error(error.message);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    try {
      const res = await axios.put(`/api/note/update-note-pinned/${noteData._id}`, {
        isPinned: !noteData.isPinned,
      });

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      console.error("updateIsPinned error:", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-md:m-5">
            {allNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={
              isSearch
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtakcQoMFXwFwnlochk9fQSBkNYkO5rSyY9A&s"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"
            }
            message={
              isSearch
                ? "Oops! No Notes found matching your search"
                : `Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspirations, and reminders. Let's get started!`
            }
          />
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
