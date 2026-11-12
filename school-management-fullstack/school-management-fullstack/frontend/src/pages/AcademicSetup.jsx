
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  CalendarDays,
  BookOpen,
  Users,
  Plus,
  RefreshCw
} from "lucide-react";

export default function AcademicSetup() {
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [tab, setTab] = useState("years");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [yearForm, setYearForm] = useState({
    yearName: "",
    startDate: "",
    endDate: ""
  });

  const [classForm, setClassForm] = useState({
    className: "",
    academicYearId: "",
    totalSeats: 40
  });

  const [sectionForm, setSectionForm] = useState({
    classId: "",
    sectionName: "",
    totalSeats: 40
  });

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [y, c, s] = await Promise.all([
        api.get("/academic/years"),
        api.get("/academic/classes"),
        api.get("/academic/sections")
      ]);

      setYears(y.data);
      setClasses(c.data);
      setSections(s.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load academic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (text) => {
    setMessage(text);
    setError("");
  };

  const fail = (err) => {
    setError(err.response?.data?.message || "Operation failed.");
    setMessage("");
  };

  const addYear = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/academic/years", yearForm);
      notify(res.data.message);
      setYearForm({ yearName: "", startDate: "", endDate: "" });
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const activateYear = async (id) => {
    try {
      const res = await api.patch(`/academic/years/${id}/activate`);
      notify(res.data.message);
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const deleteYear = async (id) => {
    if (!window.confirm("Delete this academic year?")) return;

    try {
      const res = await api.delete(`/academic/years/${id}`);
      notify(res.data.message);
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const addClass = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/academic/classes", {
        ...classForm,
        totalSeats: Number(classForm.totalSeats),
        academicYearId: Number(classForm.academicYearId)
      });

      notify(res.data.message);
      setClassForm({
        className: "",
        academicYearId: "",
        totalSeats: 40
      });
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const toggleAdmission = async (item) => {
    try {
      const res = await api.patch(
        `/academic/classes/${item.id}/admission`,
        { admissionOpen: !item.admission_open }
      );

      notify(res.data.message);
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      const res = await api.delete(`/academic/classes/${id}`);
      notify(res.data.message);
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const addSection = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/academic/sections", {
        ...sectionForm,
        classId: Number(sectionForm.classId),
        totalSeats: Number(sectionForm.totalSeats)
      });

      notify(res.data.message);
      setSectionForm({
        classId: "",
        sectionName: "",
        totalSeats: 40
      });
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const deleteSection = async (id) => {
    if (!window.confirm("Delete this section?")) return;

    try {
      const res = await api.delete(`/academic/sections/${id}`);
      notify(res.data.message);
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  return (
    <main className="page-wrap academic-page">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">SCHOOL MANAGEMENT</span>
          <h1>Academic Setup</h1>
          <p>Manage academic years, classes, sections and admissions.</p>
        </div>

        <button className="btn btn-outline" onClick={loadData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <CalendarDays />
          <h3>{years.length}</h3>
          <p>Academic Years</p>
        </article>
        <article className="dashboard-card">
          <BookOpen />
          <h3>{classes.length}</h3>
          <p>Classes</p>
        </article>
        <article className="dashboard-card">
          <Users />
          <h3>{sections.length}</h3>
          <p>Sections</p>
        </article>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading academic data...</p>}

      <div className="academic-tabs">
        <button onClick={() => setTab("years")}
          className={tab === "years" ? "btn btn-primary" : "btn btn-outline"}>
          Academic Years
        </button>
        <button onClick={() => setTab("classes")}
          className={tab === "classes" ? "btn btn-primary" : "btn btn-outline"}>
          Classes
        </button>
        <button onClick={() => setTab("sections")}
          className={tab === "sections" ? "btn btn-primary" : "btn btn-outline"}>
          Sections
        </button>
      </div>

      {tab === "years" && (
        <section className="dashboard-card academic-panel">
          <h2>Academic Year Management</h2>

          <form onSubmit={addYear} className="academic-form">
            <input required placeholder="2029-2030"
              value={yearForm.yearName}
              onChange={e => setYearForm({
                ...yearForm, yearName: e.target.value
              })} />

            <input required type="date"
              value={yearForm.startDate}
              onChange={e => setYearForm({
                ...yearForm, startDate: e.target.value
              })} />

            <input required type="date"
              value={yearForm.endDate}
              onChange={e => setYearForm({
                ...yearForm, endDate: e.target.value
              })} />

            <button className="btn btn-primary">
              <Plus size={16} /> Add Year
            </button>
          </form>

          <div className="academic-table-wrap">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {years.map(y => (
                  <tr key={y.id}>
                    <td>{y.year_name}</td>
                    <td>{String(y.start_date).slice(0, 10)}</td>
                    <td>{String(y.end_date).slice(0, 10)}</td>
                    <td>{y.status}</td>
                    <td>
                      {y.status !== "ACTIVE" && (
                        <button className="btn btn-outline"
                          onClick={() => activateYear(y.id)}>
                          Activate
                        </button>
                      )}
                      <button className="btn btn-outline"
                        onClick={() => deleteYear(y.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "classes" && (
        <section className="dashboard-card academic-panel">
          <h2>Class Management</h2>

          <form onSubmit={addClass} className="academic-form">
            <input required placeholder="Class 5"
              value={classForm.className}
              onChange={e => setClassForm({
                ...classForm, className: e.target.value
              })} />

            <select required value={classForm.academicYearId}
              onChange={e => setClassForm({
                ...classForm, academicYearId: e.target.value
              })}>
              <option value="">Select academic year</option>
              {years.map(y => (
                <option key={y.id} value={y.id}>{y.year_name}</option>
              ))}
            </select>

            <input required type="number" min="0"
              value={classForm.totalSeats}
              onChange={e => setClassForm({
                ...classForm, totalSeats: e.target.value
              })} />

            <button className="btn btn-primary">
              <Plus size={16} /> Add Class
            </button>
          </form>

          <div className="academic-table-wrap">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Academic Year</th>
                  <th>Total Seats</th>
                  <th>Available Seats</th>
                  <th>Admission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.id}>
                    <td>{c.class_name}</td>
                    <td>{c.year_name}</td>
                    <td>{c.total_seats}</td>
                    <td>{c.available_seats}</td>
                    <td>
                      <button className="btn btn-outline"
                        onClick={() => toggleAdmission(c)}>
                        {c.admission_open ? "Close" : "Open"}
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-outline"
                        onClick={() => deleteClass(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "sections" && (
        <section className="dashboard-card academic-panel">
          <h2>Section Management</h2>

          <form onSubmit={addSection} className="academic-form">
            <select required value={sectionForm.classId}
              onChange={e => setSectionForm({
                ...sectionForm, classId: e.target.value
              })}>
              <option value="">Select class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.class_name} - {c.year_name}
                </option>
              ))}
            </select>

            <input required placeholder="Section C"
              value={sectionForm.sectionName}
              onChange={e => setSectionForm({
                ...sectionForm, sectionName: e.target.value
              })} />

            <input required type="number" min="0"
              value={sectionForm.totalSeats}
              onChange={e => setSectionForm({
                ...sectionForm, totalSeats: e.target.value
              })} />

            <button className="btn btn-primary">
              <Plus size={16} /> Add Section
            </button>
          </form>

          <div className="academic-table-wrap">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Total Seats</th>
                  <th>Available Seats</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(s => (
                  <tr key={s.id}>
                    <td>{s.class_name}</td>
                    <td>{s.year_name}</td>
                    <td>{s.section_name}</td>
                    <td>{s.total_seats}</td>
                    <td>{s.available_seats}</td>
                    <td>{s.status}</td>
                    <td>
                      <button className="btn btn-outline"
                        onClick={() => deleteSection(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
