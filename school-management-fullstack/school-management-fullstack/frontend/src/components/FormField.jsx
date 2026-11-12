export default function FormField({ label, name, value, onChange, type = "text", placeholder, required = false, autoComplete }) {
  return (
    <label className="field">
      <span>{label}{required && <b className="required"> *</b>}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        required={required}
        autoComplete={autoComplete}
      />
    </label>
  );
}
