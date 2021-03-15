import React, { useState, useEffect } from "react";
import SettingsPage from "./SettingsPage";
import EditSettingsPage from "./EditSettingsPage";
import ErrorBoundary from "./ErrorBoundary";
import { getCurrentUserData } from "./utils/getCurrentUserData";

// hook for useState here
// figure out what page to display
function App() {
  const [currentPage, setPage] = useState({
    page: "list_settings",
  });

  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    (async function loadCurrentUser() {
      const userData = await getCurrentUserData();
      setCurrentUser(userData);
      if (userData?.profile?.name !== "Administrator") {
        window.alert("Sorry only CRM admins can access this screen");
      }
    })();
  }, []);

  const page = () => {
    if (currentPage.page === "list_settings") {
      return <SettingsPage setPage={setPage} message={currentPage.message} />;
    } else if (currentPage.page === "edit_setting") {
      return (
        <EditSettingsPage setPage={setPage} recordID={currentPage.recordID} />
      );
    }
  };

  if (currentUser?.profile?.name !== "Administrator") {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="App">{page()}</div>
    </ErrorBoundary>
  );
}

export default App;
