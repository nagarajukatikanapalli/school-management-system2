
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import FormField from "../components/FormField";
import Notice from "../components/Notice";
import { signupSchool } from "../services/api";

const initial = {
  schoolId: "",
  schoolName: "",
  email: "",
  phone: "",
  password: "",
  databaseName: ""
};

export default function Signup() {
  const [form, setForm] = useState(initial);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "info", text: "" });
  const navigate = useNavigate();

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    if (!agree) {
      setNotice({
        type: "error",
        text: "Please accept the terms and conditions."
      });
      return;
    }

    setLoading(true);

    try {
      const data = await signupSchool(form);

      setNotice({
        type: "success",
        text: data.message || "School registration submitted successfully."
      });

      setForm(initial);
      setAgree(false);

      setTimeout(() => navigate("/login"), 1800);

    } catch (error) {
      setNotice({
        type: "error",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please check the backend."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrap narrow">
      <div className="page-heading">
        <span className="eyebrow">SCHOOL PARTNER</span>
        <h1>Register your school</h1>
        <p>Create a school account to get started with EduPortal.</p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <div className="form-card-title">
          <Building2 />
          <div>
            <h2>School information</h2>
            <p>Enter your official school details.</p>
          </div>
        </div>

        <Notice type={notice.type}>{notice.text}</Notice>

        <div className="form-grid">
          <FormField
            label="School ID"
            name="schoolId"
            value={form.schoolId}
            onChange={update}
            required
          />

          <FormField
            label="School Name"
            name="schoolName"
            value={form.schoolName}
            onChange={update}
            required
          />

          <FormField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            required
          />

          <FormField
            label="Phone number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={update}
            required
          />

          <FormField
            label="Database Name"
            name="databaseName"
            value={form.databaseName}
            onChange={update}
            placeholder="e.g. nagaraju_db"
            required
          />

          <div className="full-width">
            <FormField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={update}
              required
            />
          </div>
        </div>

        <label className="check-row">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>I agree to the terms and conditions.</span>
        </label>

        <button
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create school account"}
        </button>

        <p className="form-bottom">
          Already registered? <Link to="/login">School login</Link>
        </p>
      </form>
    </main>
  );
}
