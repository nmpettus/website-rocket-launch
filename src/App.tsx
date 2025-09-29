function App() {
  console.log("App component is loading - this proves our changes are working!");
  
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f9ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      <div>
        <h1 style={{ color: "#1e40af", marginBottom: "10px" }}>
          React is Working! ✅
        </h1>
        <p style={{ color: "#64748b" }}>
          If you see this message, the React app is loading correctly.
        </p>
        <p style={{ color: "#64748b", marginTop: "10px", fontSize: "14px" }}>
          Check the browser console for confirmation log.
        </p>
      </div>
    </div>
  );
}

export default App;