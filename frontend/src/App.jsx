import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [offer, setOffer] = useState("");
  const [targetCustomers, setTargetCustomers] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("offline"));
  }, []);

  async function generateContent(event) {
    event.preventDefault();

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessName,
            businessType,
            offer,
            targetCustomers,
            location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Backend error ${response.status}`
        );
      }

      setResult(data.generated_content);
    } catch (error) {
      console.error(error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">AI</div>
          <span>Business Assistant</span>
        </div>

        <div className="status">
          <span
            className={`status-dot ${
              backendStatus === "healthy" ? "online" : ""
            }`}
          ></span>
          Backend: {backendStatus}
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <p className="eyebrow">AI-POWERED BUSINESS TOOLS</p>

          <h1>
            Grow your business
            <br />
            with <span>AI</span>
          </h1>

          <p className="hero-text">
            Generate marketing content, product descriptions,
            social media posts and business ideas in seconds.
          </p>
        </section>

        <form className="business-card" onSubmit={generateContent}>
          <div className="card-header">
            <div>
              <h2>Tell us about your business</h2>
              <p>
                Enter a few details and we'll create useful
                AI-powered marketing content.
              </p>
            </div>

            <div className="step">STEP 1</div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Business name</label>
              <input
                type="text"
                placeholder="e.g. Sweet Bakery"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Business type</label>
              <input
                type="text"
                placeholder="e.g. Bakery, Restaurant, Agency"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
              />
            </div>

            <div className="form-group full">
              <label>What does your business offer?</label>
              <textarea
                placeholder="Describe your products or services..."
                rows="4"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Target customers</label>
              <input
                type="text"
                placeholder="e.g. Students, families, startups"
                value={targetCustomers}
                onChange={(e) =>
                  setTargetCustomers(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="continue-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate AI Content"}
            <span>→</span>
          </button>
        </form>

        {result && (
          <section className="result-card">
            <div className="result-header">
              <h2>✨ AI Generated Content</h2>
            </div>

            <div className="result-content">
              {result}
            </div>
          </section>
        )}

        <section className="features">
          <div className="feature">
            <div className="feature-icon">✦</div>
            <h3>Social Media</h3>
            <p>
              Create engaging posts for Instagram, LinkedIn and more.
            </p>
          </div>

          <div className="feature">
            <div className="feature-icon">✉</div>
            <h3>Marketing Emails</h3>
            <p>
              Generate professional promotional emails quickly.
            </p>
          </div>

          <div className="feature">
            <div className="feature-icon">✎</div>
            <h3>Product Content</h3>
            <p>
              Turn your product information into compelling
              descriptions.
            </p>
          </div>
        </section>
      </main>

      <footer>
        AI Business Assistant · Portfolio Project
      </footer>
    </div>
  );
}

export default App;
