import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Pagination from "./components/Pagination";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import StudentSearch from "./components/StudentSearch";

function App() {

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);

  const [limit] = useState(7);

  const [total, setTotal] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const totalPages = Math.ceil(total / limit);

  const fetchStudents = useCallback(async () => {
    try {

      const response = await axios.get(
        `http://localhost:5000/students?page=${page}&limit=${limit}`
      );

      setStudents(response.data.data);

      setTotal(response.data.total);

    } catch (error) {

      console.log(error);
    }
  }, [page, limit]);

  useEffect(() => {
    if (!isSearching) {
      fetchStudents();
    }
  }, [fetchStudents, isSearching]);

  const refreshStudents = useCallback(async () => {
    if (!isSearching || !searchId) {
      fetchStudents();
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/students/${searchId}`
      );

      const studentRows = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setStudents(studentRows);
      setTotal(studentRows.length);
    } catch (error) {
      console.log(error);

      setStudents([]);
      setTotal(0);
    }
  }, [fetchStudents, isSearching, searchId]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleSearchStudent = async (e) => {
    e.preventDefault();

    if (!searchId) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/students/${searchId}`
      );

      const studentRows = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setStudents(studentRows);
      setTotal(studentRows.length);
      setPage(1);
      setIsSearching(true);
      setSelectedStudent(null);
    } catch (error) {
      console.log(error);

      setStudents([]);
      setTotal(0);
      setIsSearching(true);

      Swal.fire(
        "Not Found",
        "No student found with this ID",
        "info"
      );
    }
  };

  const handleSearchIdChange = (value) => {
    setSearchId(value.replace(/\D/g, ""));
  };

  const handleClearSearch = () => {
    setSearchId("");
    setIsSearching(false);
    setSelectedStudent(null);
    setPage(1);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleCancelEdit = () => {
    setSelectedStudent(null);
  };

  const handleDeleteStudent = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This student will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/students/${id}`);

      Swal.fire(
        "Deleted",
        "Student deleted successfully",
        "success"
      );

      if (isSearching) {
        handleClearSearch();
      } else if (students.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchStudents();
      }
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        "Failed to delete student",
        "error"
      );
    }
  };

  return (
    <div className="container mt-5">

      <h1 className="mb-4">
        Student Management System
      </h1>

      <StudentForm
        fetchStudents={refreshStudents}
        selectedStudent={selectedStudent}
        onCancelEdit={handleCancelEdit}
      />

      <StudentSearch
        searchId={searchId}
        isSearching={isSearching}
        onSearchIdChange={handleSearchIdChange}
        onSearchStudent={handleSearchStudent}
        onClearSearch={handleClearSearch}
      />

      <StudentList
        students={students}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {!isSearching && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      )}

    </div>
  );
}

export default App;
