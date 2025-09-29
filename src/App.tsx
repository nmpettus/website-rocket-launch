import React from "react";

function App() {
  return React.createElement(
    "div",
    {
      style: {
        minHeight: "100vh",
        backgroundColor: "#f0f9ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif"
      }
    },
    React.createElement(
      "div",
      { style: { textAlign: "center" } },
      React.createElement("h1", null, "Testing React"),
      React.createElement("p", null, "If you see this, React is working!")
    )
  );
}

export default App;