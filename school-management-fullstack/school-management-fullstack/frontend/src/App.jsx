import { useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admissions from "./pages/Admissions";
import Dashboard from "./pages/Dashboard";
import AcademicSetup from "./pages/AcademicSetup";
function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("schoolUser");
    navigate("/login");
    setOpen(false);
  }
  return (
    <header className="topbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-icon"><GraduationCap size={24} /></span>
        <span>Edu<span className="brand-light">Portal</span></span>
      </Link>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav-links show" : "nav-links"}>
        <NavLink to="/admissions" onClick={() => setOpen(false)}>Find Schools</NavLink>
        <NavLink to="/signup" onClick={() => setOpen(false)}>School Registration</NavLink>
        {token ? (
          <>
            <NavLink to="/dashboard" onClick={() => setOpen(false)}><LayoutDashboard size={16}/> Dashboard</NavLink>
            <button className="nav-button" onClick={logout}><LogOut size={16}/> Logout</button>
          </>
        ) : <NavLink className="login-link" to="/login" onClick={() => setOpen(false)}>School Login</NavLink>}
      </nav>
    </header>
  );
}

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">ONE PLATFORM · MANY SCHOOLS</span>
          <h1>Every school journey starts <span>here.</span></h1>
          <p>Discover schools, explore open admissions, and manage your school's admission process from one simple portal.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/admissions">Explore Admissions</Link>
            <Link className="btn btn-outline" to="/signup">Register Your School</Link>
          </div>
          <div className="hero-note"><span className="dot"></span> A simple portal for schools and families</div>
        </div>
        <div className="hero-art">
          <div className="art-circle"></div>
          <div className="art-card art-card-main">
            <div className="art-cap"><GraduationCap size={36}/></div>
            <h3>Learn. Grow. Achieve.</h3>
            <p>Building brighter futures together.</p>
            <div className="art-lines"><i></i><i></i><i></i></div>
          </div>
          <div className="floating-chip chip-one">Admissions open</div>
          <div className="floating-chip chip-two">Your future starts now</div>
        </div>
      </section>
      <section className="feature-section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Everything in one place</h2>
          <p>Easy steps for school administrators and parents.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-number">01</span><h3>Register a school</h3><p>Schools can submit their details and request access to the portal.</p></article>
          <article className="feature-card"><span className="feature-number">02</span><h3>Discover admissions</h3><p>Families can search schools by academic year and class.</p></article>
          <article className="feature-card"><span className="feature-number">03</span><h3>Manage applications</h3><p>Use the school dashboard as the starting point for admission operations.</p></article>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/academic-setup" element={<AcademicSetup />} />
        <Route path="*" element={<main className="page-wrap"><div className="empty-state"><h2>Page not found</h2><Link to="/">Go to home</Link></div></main>} />
      </Routes>
      <footer className="footer">
        <div className="footer-brand"><GraduationCap size={20}/> EduPortal</div>
        <span>School Admission Portal</span>
        <span>© {new Date().getFullYear()} EduPortal</span>
      </footer>
    </>
  );
}
