import { useState, useContext } from "react";

import { ThemeContext } from "../app/providers";

import {
  saveDriverProfile,
  DEFAULT_DRIVER_PROFILE,
  startDriverSession,
} from "../utils/storage";


function DriverSetupPage({ onLogin }) {

  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState(DEFAULT_DRIVER_PROFILE);


  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }


  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  function handleSubmit(e) {

    e.preventDefault();

    saveDriverProfile(form);

    startDriverSession();

    onLogin(form);

  }


  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-6
        py-10
        transition-colors
        duration-300
      "
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >

      <div
        className="
          w-full
          max-w-4xl
          rounded-3xl
          p-8
          md:p-10
          transition-colors
          duration-300
        "
        style={{
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow:
            theme.mode === "dark"
              ? "0 20px 60px rgba(0, 0, 0, 0.25)"
              : "0 20px 60px rgba(0, 0, 0, 0.08)",
        }}
      >

        {/* ============================================================
            HEADER
        ============================================================= */}

        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div
              className="w-1 h-10 rounded-full"
              style={{
                background: theme.primary,
              }}
            />

            <div>

              <h1
                className="
                  text-3xl
                  md:text-5xl
                  font-bold
                  tracking-tight
                "
                style={{
                  color: theme.text,
                }}
              >
                Driver Registration
              </h1>

            </div>

          </div>


          <p
            className="mt-4 text-base md:text-lg"
            style={{
              color: theme.textSecondary,
            }}
          >
            Complete your profile before using the Smart Steering
            Wheel Dashboard.
          </p>

        </div>


        {/* ============================================================
            FORM
        ============================================================= */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* FULL NAME */}

          <SettingsInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            theme={theme}
          />


          {/* AGE */}

          <ThemeSelect
            label="Age"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
            theme={theme}
          >

            <option value="">
              Select Age
            </option>

            {Array.from(
              { length: 83 },
              (_, i) => (
                <option
                  key={i}
                  value={i + 18}
                >
                  {i + 18}
                </option>
              )
            )}

          </ThemeSelect>


          {/* GENDER */}

          <ThemeSelect
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            theme={theme}
          >

            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>

            <option value="Prefer not to say">
              Prefer not to say
            </option>

          </ThemeSelect>


          {/* BLOOD GROUP */}

          <ThemeSelect
            label="Blood Group"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            required
            theme={theme}
          >

            <option value="">
              Select Blood Group
            </option>

            <option value="A+">
              A+
            </option>

            <option value="A-">
              A-
            </option>

            <option value="B+">
              B+
            </option>

            <option value="B-">
              B-
            </option>

            <option value="AB+">
              AB+
            </option>

            <option value="AB-">
              AB-
            </option>

            <option value="O+">
              O+
            </option>

            <option value="O-">
              O-
            </option>

          </ThemeSelect>


          {/* EMERGENCY CONTACT NAME */}

          <SettingsInput
            label="Emergency Contact Name"
            name="emergencyName"
            value={form.emergencyName}
            onChange={handleChange}
            required
            theme={theme}
          />


          {/* EMERGENCY CONTACT */}

          <SettingsInput
            label="Emergency Contact"
            name="emergencyPhone"
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            value={form.emergencyPhone}
            onChange={handleChange}
            required
            theme={theme}
          />


          {/* MEDICAL CONDITIONS */}

          <SettingsInput
            label="Medical Conditions"
            name="medicalConditions"
            value={form.medicalConditions}
            onChange={handleChange}
            theme={theme}
          />


          {/* CURRENT MEDICATIONS */}

          <SettingsInput
            label="Current Medications"
            name="medications"
            value={form.medications}
            onChange={handleChange}
            theme={theme}
          />


          {/* DRIVING LICENSE */}

          <SettingsInput
            label="Driving License Number"
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            required
            theme={theme}
          />


          {/* ==========================================================
              SUBMIT
          =========================================================== */}

          <div className="md:col-span-2 flex justify-end mt-2">

            <button
              type="submit"
              className="
                px-8
                py-3
                rounded-xl
                font-semibold
                transition-all
                duration-200
                hover:scale-[1.02]
                hover:brightness-110
                cursor-pointer
              "
              style={{
                background: theme.primary,
                color:
                  theme.mode === "dark"
                    ? "#071014"
                    : "#FFFFFF",
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


/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function SettingsInput({
  label,
  theme,
  ...props
}) {

  return (

    <div>

      <label
        className="
          block
          text-[10px]
          uppercase
          tracking-widest
          mb-2
        "
        style={{
          color: theme.textSecondary,
        }}
      >
        {label}
      </label>

      <input
        {...props}
        className="
          w-full
          rounded-xl
          px-4
          py-3
          border
          outline-none
          text-sm
          transition-colors
          duration-200
        "
        style={{
          background: theme.background,
          borderColor: theme.border,
          color: theme.text,
        }}
      />

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| SELECT
|--------------------------------------------------------------------------
*/

function ThemeSelect({
  label,
  theme,
  children,
  ...props
}) {

  return (

    <div>

      <label
        className="
          block
          text-[10px]
          uppercase
          tracking-widest
          mb-2
        "
        style={{
          color: theme.textSecondary,
        }}
      >
        {label}
      </label>

      <select
        {...props}
        className="
          w-full
          rounded-xl
          px-4
          py-3
          border
          outline-none
          text-sm
          transition-colors
          duration-200
        "
        style={{
          background: theme.background,
          borderColor: theme.border,
          color: theme.text,
        }}
      >
        {children}
      </select>

    </div>
  );
}


export default DriverSetupPage;