import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://ai-business-assistant-backend-ten.vercel.app";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [business, setBusiness] = useState({
    businessName: "",
    businessType: "",
    offer: "",
    targetCustomers: "",
    location: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend unavailable");
        }

        return res.json();
      })
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus("offline");
      });
  }, []);

  function handleChange(e) {
    setBusiness({
      ...business,
      [e.target.name]: e.target.value,
    });
  }

  async function generateContent(e) {
    e.preventDefault();

    setError("");
    setResult(null);

    if (
      !business.businessName ||
      !business.businessType ||
      !business.offer ||
      !business.targetCustomers ||
      !business.location
    ) {
      setError("Please fill in all business details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(business),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to generate content"
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Could not connect to the backend."
      );
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
          <p className="eyebrow">
            AI-POWERED BUSINESS TOOLS
          </p>

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

        <form
          className="business-card"
          onSubmit={generateContent}
        >
          <div className="card-header">
            <div>
              <h2>Tell us about your business</h2>

              <p>
                Enter a few details and we'll create useful
                AI-powered content for you.
              </p>
            </div>

            <div className="step">STEP 1</div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Business name</label>

              <input
                name="businessName"
                value={business.businessName}
                onChange={handleChange}
                placeholder="e.g. Sweet Bakery"
              />
            </div>

            <div className="form-group">
              <label>Business type</label>

              <input
                name="businessType"
                value={business.businessType}
                onChange={handleChange}
                placeholder="e.g. Bakery, Restaurant, Agency"
              />
            </div>

            <div className="form-group full">
              <label>
                What does your business offer?
              </label>

              <textarea
                name="offer"
                value={business.offer}
                onChange={handleChange}
                placeholder="Describe your products or services..."
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Target customers</label>

              <input
                name="targetCustomers"
                value={business.targetCustomers}
                onChange={handleChange}
                placeholder="e.g. Students, families, startups"
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                name="location"
                value={business.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad"
              />
            </div>
          </div>

          <button
            type="submit"
            className="continue-button"
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "Generate AI Content"}

            <span>
              {loading ? "⏳" : "→"}
            </span>
          </button>
        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <section className="results">
            <h2>✨ AI Generated Content</h2>

            <div className="result-card">
              <h3>✦ Social Media</h3>

              <p>{result.socialMedia}</p>
            </div>

            <div className="result-card">
              <h3>✉ Marketing Email</h3>

              <p>{result.marketingEmail}</p>
            </div>

            <div className="result-card">
              <h3>✎ Product Description</h3>

              <p>{result.productDescription}</p>
            </div>

            <div className="result-card">
              <h3>💡 Business Ideas</h3>

              <ul>
                {result.businessIdeas?.map(
                  (idea, index) => (
                    <li key={index}>{idea}</li>
                  )
                )}
              </ul>
            </div>
          </section>
        )}

        <section className="features">
          <div className="feature">
            <div className="feature-icon">✦</div>

            <h3>Social Media</h3>

            <p>
              Create engaging posts for Instagram,
              LinkedIn and more.
            </p>
          </div>

          <div className="feature">
            <div className="feature-icon">✉</div>

            <h3>Marketing Emails</h3>

            <p>
              Generate professional promotional emails
              quickly.
            </p>
          </div>

          <div className="feature">
            <div className="feature-icon">✎</div>

            <h3>Product Content</h3>

            <p>
              Turn your product information into
              compelling descriptions.
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