export function Inputbox({ label, placeholder, name, value, onChange }) {
    return (
      <div>
        <div className="text-sm font-medium text-left py-2">
          {label}
        </div>
        <input
          type={name === "password" ? "password" : "text"} // Hide password input
          placeholder={placeholder}
          name={name} // Ensure `name` is passed
          value={value} // Ensure controlled component
          onChange={onChange}
          className="w-full px-2 py-1 border border-slate-300 rounded"
        />
      </div>
    );
  }
  