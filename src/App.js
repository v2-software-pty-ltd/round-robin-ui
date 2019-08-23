import React, { useState } from "react";
import SettingsPage from './SettingsPage';
import EditSettingsPage from './EditSettingsPage';

// hook for useState here
// figure out what page to display
function App() {
  const [currentPage, setPage] = useState({
    page: 'list_settings'
  });

  if (currentPage.page === 'list_settings') {
    debugger;
    return (
      <div className="App">
        <SettingsPage setPage={setPage} message={currentPage.message} />
      </div>
    )
  } else if (currentPage.page === 'edit_setting') {
    return (
      <div className="App">
        <EditSettingsPage setPage={setPage} recordID={currentPage.recordID} />
      </div>
    );
  }
}

export default App;
