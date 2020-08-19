export async function loadRoundRobinSettings() {
  await window.ZOHO.embeddedApp.init();

  const roundRobinSettingResponse = await window.ZOHO.CRM.API.getAllRecords({
    Entity: "advancedroundrobin__Round_Robin_Settings"
  });

  if (!roundRobinSettingResponse.data) {
    return [];
  }

  const {
    data: roundRobinSettings
  } = roundRobinSettingResponse;

  return roundRobinSettings.map((roundRobinSetting) => {
    const ownerName = roundRobinSetting['Owner']?.name ?? roundRobinSetting['advancedroundrobin.Owner']?.name ?? roundRobinSetting['advancedroundrobin.advancedroundrobin.Owner']?.name;
    return {
      ...roundRobinSetting,
      ownerName,
      key: roundRobinSetting.id
    };
  });
}

export async function loadRoundRobinSetting(recordID) {
  await window.ZOHO.embeddedApp.init();

  const {
    data: roundRobinSetting
  } = await window.ZOHO.CRM.API.getRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
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

  const result = await window.ZOHO.CRM.API.updateRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    APIData: newData,
    Trigger: ["workflow"]
  });

  return result;
}

export async function addNewSetting() {
  await window.ZOHO.embeddedApp.init();

  const result = await window.ZOHO.CRM.API.insertRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    APIData: {
      Name: 'New Setting',
      advancedroundrobin__Module: 'Leads'
    },
    Trigger: ["workflow"]
  });

  return result.data[0];
}
