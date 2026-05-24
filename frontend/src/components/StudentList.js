function StudentList({ students, onEditStudent, onDeleteStudent }) {

  return (
    <div className="card p-4">

      <h3>Students List</h3>

      <table className="table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {students.map((student) => (
            <tr key={student.mark_id || student.id}>

              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td>{student.subject || "-"}</td>
              <td>{student.score ?? "-"}</td>
              <td>
                <div className="d-flex gap-2">

                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => onEditStudent(student)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDeleteStudent(student.id)}
                  >
                    Delete
                  </button>

                </div>
              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}

export default StudentList;
