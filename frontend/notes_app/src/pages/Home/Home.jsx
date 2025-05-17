import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Toast from '../../components/ToastMessage/Toast';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import EmptyCard from '../../components/Cards/EmptyCard';

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add', // add or edit
    data: null
  });

  const [showToastMessage, setShowToastMessage] = useState({
    isShown: false,
    message: "",
    type: "add"
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"});
  }

  const showToastMsg = (message, type) => {
    setShowToastMessage({
      isShown: true,
      message,
      type,
    });
  };

  const closeToastMsg = () => {
    setShowToastMessage({
      isShown: false,
      message: "",
    });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if(error.response.status === 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if(response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }

    } catch (error) {
      console.log("Error Occurred! Please Try Again!")
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id
    try {
        const response = await axiosInstance.delete("/delete-note/" + noteId);

        if(response.data && response.data.note){
            showToastMsg("Note Deleted Successfully", 'delete')
            getAllNotes();
        }
    } catch (error) {
        if(error.response && error.response.data && error.response.data.message){
          console.log("Error Occurred! Please Try Again!")
        }
        
    }
  };

  // Search Notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: {query},
      });

      if (response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }

    } catch (error) {
      console.log(error);
    }
  }

  // Update Pinned
  const updateIsPinned = async (noteData) => {
    
    const noteId = noteData._id;

    try {
        const response = await axiosInstance.put("/update-pinned/" + noteId, {
            isPinned: !noteData.isPinned,
        });

        if(response.data && response.data.note){
            showToastMsg("Note Updated Successfully")
            getAllNotes();
        }
    } catch (error) {
        console.log(error);
    }
  }

const handleClearSearch = () => {
  setIsSearch(false);
  getAllNotes();
}

useEffect(() => {
  getAllNotes();
  getUserInfo();
  return () => {};
}, []);
 
  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto">
          {allNotes.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-8">
              {allNotes.map((item) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateIsPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard message={isSearch ? "No notes found..." : "You have no notes yet"} />
          )}
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={() => {                                      
        setOpenAddEditModal({isShown: true, type: 'add', data: null});
      }} >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        // className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        className="w-[90%] md:w-[60%] lg:w-[40%] max-h-[90vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
      >
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => {
              setOpenAddEditModal({isShown: false, type:"add", data:null});
            }}
            getAllNotes={getAllNotes}
            showToastMsg={showToastMsg}
          />
      </Modal>
      <Toast 
        isShown={showToastMessage.isShown}
        message={showToastMessage.message}
        type={showToastMessage.type}
        onClose={closeToastMsg}
      />
      
    </>
  )
}

export default Home