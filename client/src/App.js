import React, { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("travel");

  // Travel Assistant states
  const [formData, setFormData] = useState({
    name: "",
    arrival_city: "",
    arrival_time: "",
    luggage: "",
  });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Bhasha Mitra states
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [translated, setTranslated] = useState("");
  const [languages, setLanguages] = useState([]);

  // Fetch available languages from backend
  useEffect(() => {
    fetch("https://mitra-ai-travel-assistant.onrender.com/api/languages")
      .then((res) => res.json())
      .then((data) => setLanguages(data))
      .catch((err) => console.error("Error loading languages:", err));
  }, []);

  // Handle travel form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle travel booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBooking(null);
    try {
      const res = await fetch("https://mitra-ai-travel-assistant.onrender.com/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setBooking(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Handle translation
  const handleTranslate = async (e) => {
    e.preventDefault();
    setTranslated("");
    if (!text || !language) return alert("Enter text and select a language");
    try {
      const res = await fetch("https://mitra-ai-travel-assistant.onrender.com/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      const data = await res.json();
      setTranslated(data.translatedText);
    } catch (err) {
      console.error("Translation error:", err);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)",
        fontFamily: "Poppins, sans-serif",
        color: "#222",
        padding: "0",
        margin: "0",
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          backgroundColor: "rgba(255,255,255,0.7)",
          padding: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => setActiveTab("travel")}
          style={{
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "600",
            backgroundColor: activeTab === "travel" ? "#FF9933" : "#ddd",
            color: activeTab === "travel" ? "white" : "black",
          }}
        >
          🧭 Mitra Travel Assistant
        </button>
        <button
          onClick={() => setActiveTab("bhasha")}
          style={{
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "600",
            backgroundColor: activeTab === "bhasha" ? "#138808" : "#ddd",
            color: activeTab === "bhasha" ? "white" : "black",
          }}
        >
          🗣️ Bhasha Mitra
        </button>
      </nav>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "30px",
          backdropFilter: "blur(3px)",
        }}
      >
        {/* ---------- Travel Assistant ---------- */}
        {activeTab === "travel" && (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              background: "rgba(255,255,255,0.85)",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h2>🧳 Mitra Travel & Heritage Assistant</h2>
            <form onSubmit={handleBooking}>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="arrival_city"
                placeholder="Enter arrival city"
                value={formData.arrival_city}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="arrival_time"
                placeholder="Enter arrival time"
                value={formData.arrival_time}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="number"
                name="luggage"
                placeholder="Enter luggage weight (kg)"
                value={formData.luggage}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>
                {loading ? "Booking..." : "Book Now"}
              </button>
            </form>

            {booking && (
              <div style={{ marginTop: "20px" }}>
                <h3>Booking Status: ✅ {booking.booking_status}</h3>
                <p>
                  <b>Arrival City:</b> {booking.arrival_city}
                </p>
                <p>
                  <b>Arrival Time:</b> {booking.arrival_time}
                </p>
                <p>
                  <b>Estimated Fare:</b> ₹{booking.estimated_fare}
                </p>
                <p>
                  <b>Helper:</b> {booking.assigned_helper.name} ⭐
                  {booking.assigned_helper.rating}
                </p>

                <h4>Top Places to Visit:</h4>
                <ul>
                  {booking.recommended_places.map((p, i) => (
                    <li key={i}>
                      <b>{p.place}</b> — {p.tagline}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ---------- Bhasha Mitra ---------- */}
        {activeTab === "bhasha" && (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              background: "rgba(255,255,255,0.85)",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h2>🗣️ Bhasha Mitra — Multilingual AI Assistant</h2>
            <form onSubmit={handleTranslate}>
              <textarea
                placeholder="Enter text in English"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ ...inputStyle, height: "100px" }}
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select target language</option>
                {languages.map((lang, i) => (
                  <option key={i} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button type="submit" style={buttonStyle}>
                Translate
              </button>
            </form>

            {translated && (
              <div
                style={{
                  marginTop: "20px",
                  background: "rgba(255,255,255,0.6)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <h4>🪄 Translated Text:</h4>
                <p style={{ fontSize: "18px" }}>{translated}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#0057A7",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "16px",
};
