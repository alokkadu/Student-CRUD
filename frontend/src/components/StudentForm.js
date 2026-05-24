import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function StudentForm({ fetchStudents, selectedStudent, onCancelEdit }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    mark_id: "",
    name: "",
    email: "",
    age: "",
    subject: "",
    score: "",
  });

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        mark_id: selectedStudent.mark_id || "",
        name: selectedStudent.name,
        email: selectedStudent.email,
        age: selectedStudent.age,
        subject: selectedStudent.subject || "",
        score: selectedStudent.score || "",
      });
      setIsModalOpen(true);
    }
  }, [selectedStudent]);

  const resetForm = () => {
    setFormData({
      mark_id: "",
      name: "",
      email: "",
      age: "",
      subject: "",
      score: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNumberChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/\D/g, ""),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedStudent) {
        await axios.put(
          `http://localhost:5000/students/${selectedStudent.id}`,
          formData
        );

        Swal.fire(
          "Success",
          "Student updated successfully",
          "success"
        );

        onCancelEdit();
      } else {
        await axios.post(
          "http://localhost:5000/students",
          formData
        );

        Swal.fire(
          "Success",
          "Student added successfully",
          "success"
        );
      }

      resetForm();

      setIsModalOpen(false);

      fetchStudents();

    } catch (error) {

      console.log(error);

      Swal.fire(
        "Error",
        selectedStudent ? "Failed to update student" : "Failed to add student",
        "error"
      );
    }
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
    onCancelEdit();
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);

    if (selectedStudent) {
      onCancelEdit();
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-4">

        <button
          className="btn btn-primary"
          type="button"
          onClick={handleOpenModal}
        >
          Create Student
        </button>

      </div>

      {isModalOpen && (
        <>
          <div
            className="modal show d-block"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title fs-5">
                    {selectedStudent ? "Update Student" : "Add Student"}
                  </h3>

                  <button
                    className="btn-close"
                    type="button"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="form-control mb-3"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <div className="form-text mb-3">
                      Existing email will add a new subject for that student.
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="age"
                      placeholder="Enter Age"
                      className="form-control mb-3"
                      value={formData.age}
                      onChange={handleNumberChange}
                      required
                    />

                    <input
                      type="text"
                      name="subject"
                      placeholder="Enter Subject"
                      className="form-control mb-3"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="score"
                      placeholder="Enter Marks"
                      className="form-control"
                      value={formData.score}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-primary"
                      type="submit"
                    >
                      {selectedStudent ? "Update Student" : "Add Student"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}

export default StudentForm;
