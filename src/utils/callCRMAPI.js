export async function loadRoundRobinSettings() {
  await window.ZOHO.embeddedApp.init();

  const roundRobinSettingResponse = await window.ZOHO.CRM.API.getAllRecords({
    Entity: "advancedroundrobin__Round_Robin_Settings",
  });

  if (!roundRobinSettingResponse.data) {
    return [];
  }

  const { data: roundRobinSettings } = roundRobinSettingResponse;

  return roundRobinSettings.map((roundRobinSetting) => {
    const ownerName =
      roundRobinSetting["Owner"]?.name ??
      roundRobinSetting["advancedroundrobin.Owner"]?.name ??
      roundRobinSetting["advancedroundrobin.advancedroundrobin.Owner"]?.name;
    return {
      ...roundRobinSetting,
      ownerName,
      key: roundRobinSetting.id,
    };
  });
}

export async function loadRoundRobinSetting(recordID) {
  await window.ZOHO.embeddedApp.init();

  const { data: roundRobinSetting } = await window.ZOHO.CRM.API.getRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    RecordID: recordID,
  });

  const roundRobinAvailability = await loadRoundRobinAvailability();

  let availabilityRecordsForThisSetting = [];

  if (roundRobinAvailability) {
    availabilityRecordsForThisSetting = roundRobinAvailability.filter(
      (item) => item.advancedroundrobin__Round_Robin_Setting.id === recordID
    );
  }

  return {
    ...roundRobinSetting[0],
    round_robin_availability_id: availabilityRecordsForThisSetting.length
      ? availabilityRecordsForThisSetting[0].id
      : undefined,
    advancedroundrobin__Complex_Availability: availabilityRecordsForThisSetting.length
      ? JSON.parse(
          availabilityRecordsForThisSetting[0]
            .advancedroundrobin__Complex_Availability
        )
      : [],
  };
}

let activeUsersCache = [];

export async function loadActiveUsers() {
  if (!activeUsersCache.length) {
    await window.ZOHO.embeddedApp.init();

    const { users: activeUsers } = await window.ZOHO.CRM.API.getAllUsers({
      Type: "ActiveUsers",
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
    Entity: moduleName,
  });

  fieldsByModuleCache[moduleName] = fields;

  return fields;
}

export async function updateRoundRobinSetting(newData) {
  await window.ZOHO.embeddedApp.init();

  const result = await window.ZOHO.CRM.API.updateRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    APIData: newData,
    Trigger: ["workflow"],
  });

  if (newData.round_robin_availability_id) {
    const roundRobinAvailability = await loadRoundRobinAvailability();
    const availability = roundRobinAvailability.filter(
      (item) => item.id === newData.round_robin_availability_id
    )?.[0];
    if (availability) {
      await window.ZOHO.CRM.API.updateRecord({
        Entity: "advancedroundrobin__Round_Robin_Availability",
        APIData: {
          ...availability,
          advancedroundrobin__Complex_Availability: JSON.stringify(
            newData.advancedroundrobin__Complex_Availability
          ),
        },
        Trigger: ["workflow"],
      });
    }
  }

  return result;
}

export async function addNewSetting() {
  await window.ZOHO.embeddedApp.init();

  const result = await window.ZOHO.CRM.API.insertRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    APIData: {
      Name: "New Setting",
      advancedroundrobin__Module: "Leads",
    },
    Trigger: ["workflow"],
  });

  return result.data[0];
}

let roundRobinAvailabilityCache = [];

export async function loadRoundRobinAvailability() {
  if (!roundRobinAvailabilityCache.length) {
    await window.ZOHO.embeddedApp.init();
    const roundRobinAvailabilityResponse = await window.ZOHO.CRM.API.getAllRecords(
      {
        Entity: "advancedroundrobin__Round_Robin_Availability",
      }
    );

    const { data } = roundRobinAvailabilityResponse;
    roundRobinAvailabilityCache = data;
    return data;
  }
  return roundRobinAvailabilityCache;
}
