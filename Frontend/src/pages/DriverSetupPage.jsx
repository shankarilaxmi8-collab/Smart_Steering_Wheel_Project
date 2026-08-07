import { useState, useContext } from "react";
import { ThemeContext } from "../app/providers";
import { saveDriverProfile } from "../utils/storage";

function DriverSetupPage() {

  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    licenseNumber: "",
    emergencyName: "",
    emergencyPhone: "",
    medicalConditions: "",
    medications: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    saveDriverProfile(form);

    window.location.reload();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "#0D1117",
      }}
    >
      <div
        className="w-full max-w-4xl rounded-3xl p-10"
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <h1
          className="text-5xl font-bold"
          style={{ color: theme.text }}
        >
          Driver Registration
        </h1>

        <p
          className="mt-3 mb-10 text-lg"
          style={{ color: theme.textSecondary }}
        >
          Complete your profile before using the Smart Steering Wheel Dashboard.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-6"
        >

          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm text-slate-400 mb-2">
                Age
            </label>

            <select
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-slate-700 text-white outline-none focus:border-green-400"
                required
            >
                <option value="">Select Age</option>

                {Array.from({ length: 83 }, (_, i) => (
                <option key={i} value={i + 18}>
                    {i + 18}
                </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
                Gender
            </label>

            <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-slate-700 text-white outline-none focus:border-green-400"
                required
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
                Blood Group
            </label>

            <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-slate-700 text-white outline-none focus:border-green-400"
                required
            >
                <option value="">Select Blood Group</option>

                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
            </select>
          </div>

          <Input
            label="Emergency Contact Name"
            name="emergencyName"
            value={form.emergencyName}
            onChange={handleChange}
            required
          />

          <Input
            label="Emergency Contact"
            name="emergencyPhone"
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            value={form.emergencyPhone}
            onChange={handleChange}
            required
          />

          <Input
            label="Medical Conditions"
            name="medicalConditions"
            value={form.medicalConditions}
            onChange={handleChange}
          />

          <Input
            label="Current Medications"
            name="medications"
            value={form.medications}
            onChange={handleChange}
          />

          <Input
            label="Driving License Number"
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            required
          />

          <div className="col-span-2 flex justify-end mt-4">

            <button
              className="px-8 py-3 rounded-xl font-semibold transition hover:scale-105"
              style={{
                background: "#74C69D",
                color: "#0D1117",
              }}
            >
              Register Driver
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

function Select({ label, children, ...props }) {
    return (
        <div>
        <label className="block text-sm text-slate-400 mb-2">
            {label}
        </label>

        <select
            {...props}
            className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-slate-700 text-white outline-none focus:border-green-400"
        >
            {children}
        </select>
        </div>
    );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-2">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-slate-700 text-white outline-none focus:border-green-400"
      />
    </div>
  );
}

export default DriverSetupPage;