import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import FormField from "../components/FormField";
import Notice from "../components/Notice";
import { loginSchool } from "../services/api";
import { signupSchool } from "../services/api";
export default function Login() {
  const [form, setForm] = useState({ schoolId: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "info", text: "" });
  const navigate = useNavigate();

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setNotice({ type: "info", text: "" });
    try {
      const data = await loginSchool(form);
      const token = data.token || data.accessToken || data.data?.token;
      if (token) localStorage.setItem("token", token);
      localStorage.setItem("schoolUser", JSON.stringify(data.user || data.data?.user || { schoolId: form.schoolId, email: form.email }));
      navigate("/dashboard");
    } catch (error) {
      setNotice({ type: "error", text: error.response?.data?.message || error.response?.data?.error || "Login failed. Check your School ID, email, password, and backend API." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrap narrow">
      <div className="page-heading">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>School login</h1>
        <p>Sign in to access your school's portal.</p>
      </div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-card-title"><LogIn/><div><h2>Sign in</h2><p>Use your registered school credentials.</p></div></div>
        <Notice type={notice.type}>{notice.text}</Notice>
        <FormField label="School ID" name="schoolId" value={form.schoolId} onChange={update} required />
        <FormField label="Email address" name="email" type="email" value={form.email} onChange={update} required />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={update} required />
        <button className="btn btn-primary btn-full" disabled={loading}>{loading ? "Signing in..." : "Login to portal"}</button>
        <p className="form-bottom">New school? <Link to="/signup">Register here</Link></p>
      </form>
    </main>
  );
}
