import { useState } from "react";
import { Search, MapPin, GraduationCap, Users } from "lucide-react";
import Notice from "../components/Notice";
import { searchAdmissions } from "../services/api";

export default function Admissions() {
  const [filters, setFilters] = useState({ academicYear: "2026-2027", className: "" });
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  function update(e) { setFilters({ ...filters, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchAdmissions(filters);
      const list = Array.isArray(data) ? data : (data.admissions || data.schools || data.data || []);
      setSchools(Array.isArray(list) ? list : []);
    } catch (err) {
      setSchools([]);
      setError(err.response?.data?.message || "Could not load admissions. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrap">
      <div className="page-heading">
        <span className="eyebrow">FIND THE RIGHT SCHOOL</span>
        <h1>Explore open admissions</h1>
        <p>Search for schools accepting applications for your preferred class and academic year.</p>
      </div>
      <form className="search-panel" onSubmit={submit}>
        <label className="field"><span>Academic year</span>
          <select name="academicYear" value={filters.academicYear} onChange={update}>
            <option value="2026-2027">2026–2027</option>
            <option value="2027-2028">2027–2028</option>
            <option value="2025-2026">2025–2026</option>
          </select>
        </label>
        <label className="field"><span>Class</span>
          <select name="className" value={filters.className} onChange={update} required>
            <option value="">Select class</option>
            {["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"].map(x => <option key={x}>{x}</option>)}
          </select>
        </label>
        <button className="btn btn-primary search-button" disabled={loading}><Search size={18}/>{loading ? "Searching..." : "Search schools"}</button>
      </form>
      <Notice type="error">{error}</Notice>
      {searched && !loading && !error && schools.length === 0 && (
        <div className="empty-state"><div className="empty-icon"><Search/></div><h2>No schools found</h2><p>There are no open admission listings for these filters yet. Try another class or academic year.</p></div>
      )}
      {schools.length > 0 && (
        <section className="results-section">
          <h2>{schools.length} school{schools.length === 1 ? "" : "s"} found</h2>
          <div className="school-grid">
            {schools.map((school, i) => (
              <article className="school-card" key={school.school_id || school.id || i}>
                <div className="school-card-icon"><GraduationCap size={26}/></div>
                <div className="school-card-content">
                  <h3>{school.school_name || school.name || "School"}</h3>
                  <p><MapPin size={14}/>{school.address || school.location || "Location not provided"}</p>
                  <div className="school-meta"><span><Users size={14}/> {school.available_seats ?? "Seats"} seats</span><span>{school.class_name || filters.className}</span></div>
                  <button className="btn btn-outline btn-small" onClick={() => alert("Application submission will be enabled after the admission application API is connected.")}>View admission</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
