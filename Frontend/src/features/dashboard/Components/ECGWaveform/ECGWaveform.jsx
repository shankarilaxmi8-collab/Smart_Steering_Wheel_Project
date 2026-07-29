import "./ECGWaveform.css";

function ECGWaveform() {

  return (
    <div className="ecg-wave-container">

      <svg
        className="ecg-svg"
        viewBox="0 0 1000 250"
        preserveAspectRatio="none"
      >

        <path
          className="ecg-line"
          d="
          M0 125
          L70 125
          L90 123
          L110 126
          L130 125

          L170 125
          L190 80
          L205 210
          L220 30
          L235 125

          L300 125
          L320 123
          L340 126
          L360 125

          L400 125
          L420 80
          L435 210
          L450 30
          L465 125

          L530 125
          L550 123
          L570 126
          L590 125

          L630 125
          L650 80
          L665 210
          L680 30
          L695 125

          L760 125
          L780 123
          L800 126
          L820 125

          L860 125
          L880 80
          L895 210
          L910 30
          L925 125

          L1000 125
          "
        />

      </svg>

    </div>
  );
}

export default ECGWaveform;