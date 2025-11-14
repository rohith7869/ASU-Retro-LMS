import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTable.css";
import AddInstructorForm from "./AddInstructorForm";
import Modal from "./Modal";
import { toast } from "react-toastify";

export interface Instructor {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

const AdminTable = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentInstructor, setCurrentInstructor] = useState<Instructor | null>(null);

  const handleOpenAddModal = () => {
    setCurrentInstructor(null); // Ensure modal is clear for adding
    setModalMode('add');
    setIsModalOpen(true);
};

const handleOpenEditModal = (instructor: Instructor) => {
    setCurrentInstructor(instructor);
    setModalMode('edit');
    setIsModalOpen(true);
};
const handleAddOrUpdateInstructor = (instructor: Instructor) => {
  const updated = instructors.some(i => i.username === instructor.username);
  if (updated) {
      setInstructors(prev => prev.map(i => i.username === instructor.username ? instructor : i));
  } else {
      setInstructors(prev => [...prev, instructor]);
  }
  setIsModalOpen(false);  // Close the modal after submission
};


  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/getAllInstructors"
      );
      setInstructors(response.data);
    } catch (error) {
      setError("Failed to load instructors");
    }
    setIsLoading(false);
  };

  if (isLoading) return <div>Loading...</div>; // Using a simple div for loading message
  if (error) return <div>Error: {error}</div>; // Display errors if any
  const handleDelete = async (username: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/deleteInstructor/${username}`
      );
      if (response.status === 200) {
        // Refresh the list after delete
        fetchInstructors();
        toast.info('Instructor deleted successfully', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      toast.error('Failed to delete Instructor', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div>
      <div className="button-container">
        <button
          className="nes-btn is-primary"
          onClick={handleOpenAddModal}
        >
          Add Instructor
        </button>
      </div>
      <Modal title={`${modalMode === 'add' ? 'Add' : 'Edit'} Instructor`} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddInstructorForm 
          onSubmit={handleAddOrUpdateInstructor} 
          instructor={currentInstructor}
          
        />
      </Modal>

      <div className="table-container">
        <table className="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor, index) => (
              <tr key={index}>
                <td>{`${instructor.firstName} ${instructor.lastName}`}</td>
                <td>{instructor.email}</td>
                <td>
                  <button
                    type="button"
                    className="nes-btn is-primary"
                    style={{ marginRight: "8px" }}
                    onClick={() => handleOpenEditModal(instructor)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(instructor.username)}
                    type="button"
                    className="nes-btn is-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
