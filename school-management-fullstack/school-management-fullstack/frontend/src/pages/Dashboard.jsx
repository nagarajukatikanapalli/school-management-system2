
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  Users,
  Settings
} from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUser(
        JSON.parse(localStorage.getItem("schoolUser") || "{}")
      );
    } catch {
      setUser({});
    }

    api.get("/health")
      .then(r => setHealth(r.data))
      .catch(() => setHealth(null));
  }, [navigate]);

  return (
    <main className="page-wrap">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">SCHOOL WORKSPACE</span>
          <h1>Welcome to your dashboard</h1>
          <p>
            {user.schoolName ||
              user.school_name ||
              user.email ||
              user.schoolId ||
              "Your school account"}
          </p>
        </div>
        <span className="status-pill">Account signed in</span>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <span className="dash-icon"><Users /></span>
          <h3>Students</h3>
          <p>Student records and profiles.</p>
          <span className="muted-label">
            Backend module to be connected
          </span>
        </article>

        <article className="dashboard-card">
          <span className="dash-icon"><ClipboardList /></span>
          <h3>Admissions</h3>
          <p>Review and manage admission enquiries.</p>
          <Link to="/admissions">Explore admissions</Link>
        </article>

        <article className="dashboard-card">
          <span className="dash-icon"><BookOpen /></span>
          <h3>Academic Setup</h3>
          <p>
            Manage academic years, classes, sections,
            seats and admission status.
          </p>
          <Link to="/academic-setup">
            Manage Academic Setup
          </Link>
        </article>

        <article className="dashboard-card">
          <span className="dash-icon"><Settings /></span>
          <h3>School Settings</h3>
          <p>Configure school information and access.</p>
          <span className="muted-label">
            Coming in the next module
          </span>
        </article>
      </div>

      <div className="connection-panel">
        <h3>Backend connection</h3>
        <p>
          {health
            ? "The frontend successfully reached the backend health endpoint."
            : "Health endpoint not reachable. Check that the backend is running."}
        </p>
      </div>
    </main>
  );
}
