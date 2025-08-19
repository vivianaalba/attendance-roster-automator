import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect to login if no token
      return;
    }

    // Fetch students with token
    fetch("/api/students", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setStudents(data))
      .catch((err) => {
        console.error("Failed to fetch students:", err);
        setError(err.message);
      });
  }, [navigate]);

  return (
    <div>
      <h1>Student List</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <ul>
        {students.map((s) => (
          <li key={s._id || s.studentId}>{s.firstName} {s.lastName}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;