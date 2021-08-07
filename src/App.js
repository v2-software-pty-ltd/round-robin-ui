import React, { useState, useEffect } from "react";
import SettingsPage from "./SettingsPage";
import EditSettingsPage from "./EditSettingsPage";
import EditAvailabilityPage from "./EditAvailabilityPage";
import ErrorBoundary from "./ErrorBoundary";
import { getCurrentUserData } from "./utils/getCurrentUserData";
import { getWidgetData } from './utils/callCRMAPI'

// hook for useState here
// figure out what page to display
function App() {
  const [currentPage, setPage] = useState({
    page: "list_settings",
  });
  const [widgetData, setWidgetData] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    async function checkWidgetType() {
      const currentWidgetData = await getWidgetData();
      setWidgetData(currentWidgetData);
    }
    checkWidgetType();
  }, []);

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
    if (widgetData.widgetType === 'RelatedList') {
      return <EditAvailabilityPage teamMemberRecord={widgetData.selectedRecordData} teamMemberId={widgetData.selectedRecordID} />;
    }

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

  if (!widgetData) {
    return "Loading...";
  }

  return (
    <ErrorBoundary>
      <div className="App">{page()}</div>
    </ErrorBoundary>
  );
}

export default App;
