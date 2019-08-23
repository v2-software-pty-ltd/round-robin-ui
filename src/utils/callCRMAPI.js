export async function loadRoundRobinSettings() {
  await window.ZOHO.embeddedApp.init();

  const {
    data: roundRobinSettings
  } = await window.ZOHO.CRM.API.getAllRecords({
    Entity: "advancedroundrobin.Round_Robin_Settings"
  });

  return roundRobinSettings.map((roundRobinSetting) => {
    return {
      ...roundRobinSetting,
      ownerName: roundRobinSetting['advancedroundrobin.Owner'].name,
      key: roundRobinSetting.id
    };
  });
}

export async function loadRoundRobinSetting(recordID) {
  await window.ZOHO.embeddedApp.init();

  const {
    data: roundRobinSetting
  } = await window.ZOHO.CRM.API.getRecord({
    Entity: "advancedroundrobin.Round_Robin_Settings",
    RecordID: recordID
  });

  return roundRobinSetting[0];
}

let activeUsersCache = [];

export async function loadActiveUsers() {
  if (!activeUsersCache.length) {
    await window.ZOHO.embeddedApp.init();

    const { users: activeUsers } = await window.ZOHO.CRM.API.getAllUsers({
      Type: "ActiveUsers"
    });

    activeUsersCache = activeUsers;
    return activeUsers;
  }

  return activeUsersCache;
}

const fieldsByModuleCache = {};

export async function loadFields(moduleName) {
  if (fieldsByModuleCache[moduleName]) {
    return fieldsByModuleCache[moduleName];
  }
  await window.ZOHO.embeddedApp.init();

  const { fields } = await window.ZOHO.CRM.META.getFields({
    Entity: moduleName
  });

  fieldsByModuleCache[moduleName] = fields;

  return fields;
}

export async function updateRoundRobinSetting(newData) {
  await window.ZOHO.embeddedApp.init();

  try {
    const result = await window.ZOHO.CRM.API.updateRecord({
      Entity: "advancedroundrobin.Round_Robin_Settings",
      APIData: newData,
      Trigger: ["workflow"]
    });

    debugger;
    return result;
  } catch (e) {
    debugger;
  }
}
