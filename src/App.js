import React, { useState } from "react";
import SettingsPage from "./SettingsPage";
import EditSettingsPage from "./EditSettingsPage";
import ErrorBoundary from "./ErrorBoundary";

// hook for useState here
// figure out what page to display
function App() {
  const [currentPage, setPage] = useState({
    page: "list_settings",
  });

  const page = () => {
    if (currentPage.page === "list_settings") {
      return <SettingsPage setPage={setPage} message={currentPage.message} />;
    } else if (currentPage.page === "edit_setting") {
      return (
        <EditSettingsPage setPage={setPage} recordID={currentPage.recordID} />
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">{page()}</div>
    </ErrorBoundary>
  );
}

export default App;
