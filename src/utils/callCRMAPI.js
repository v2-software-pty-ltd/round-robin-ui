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
    let ownerName =
      roundRobinSetting["advancedroundrobin__RR_Team"]?.name ??
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
export async function loadActiveTeams() {
  await window.ZOHO.embeddedApp.init();

  const teamsResponse = await window.ZOHO.CRM.API.getAllRecords({
    Entity: "advancedroundrobin__Round_Robin_Teams",
  });

  if (!teamsResponse.data) {
    return [];
  }

  const { data: teams } = teamsResponse;

  return teams;
}

export async function loadRoundRobinSetting(recordID) {
  await window.ZOHO.embeddedApp.init();

  const { data: roundRobinSetting } = await window.ZOHO.CRM.API.getRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    RecordID: recordID,
  });

  const availabilityEnabled = await checkAvailabilityEnabled();
  const availabilityRecordsForThisSetting = await loadRoundRobinAvailabilityForRoundRobinSetting(recordID);

  return {
    ...roundRobinSetting[0],
    round_robin_availability_id:
      availabilityRecordsForThisSetting[0]?.id || undefined,
    advancedroundrobin__Timezone:
      availabilityRecordsForThisSetting[0]?.advancedroundrobin__Timezone || "",
    advancedroundrobin__Complex_Availability:
      availabilityRecordsForThisSetting[0]
        ?.advancedroundrobin__Complex_Availability || [],
    availabilityEnabled: availabilityEnabled,
    advancedroundrobin__Leave_Dates:
      availabilityRecordsForThisSetting[0]?.advancedroundrobin__Leave_Dates ||
      [],
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

export async function updateRoundRobinAvailability(availabilityData) {
  if (availabilityData.round_robin_availability_id) {
    const [availability] = await loadRoundRobinAvailabilityRecord(availabilityData.round_robin_availability_id);

    if (availability) {
      const result = await window.ZOHO.CRM.API.updateRecord({
        Entity: "advancedroundrobin__Round_Robin_Availability",
        APIData: {
          ...availability,
          advancedroundrobin__Timezone: availabilityData.advancedroundrobin__Timezone,
          advancedroundrobin__Complex_Availability: JSON.stringify(
            availabilityData.advancedroundrobin__Complex_Availability
          ),
          advancedroundrobin__Leave_Dates: JSON.stringify(
            availabilityData.advancedroundrobin__Leave_Dates
          ),
        },
        Trigger: ["workflow"],
      });

      return result;
    }
  } else {
    const data = {
      advancedroundrobin__Timezone: availabilityData.advancedroundrobin__Timezone,
      advancedroundrobin__Complex_Availability: JSON.stringify(
        availabilityData.advancedroundrobin__Complex_Availability
      ),
      Owner: availabilityData.Owner,
      Name: `Availability for ${availabilityData.Owner.name}`,
    };

    if (availabilityData.roundRobinSettingId) {
      data.advancedroundrobin__Round_Robin_Setting = {
        id: availabilityData.roundRobinSettingId,
      }
    } else if (availabilityData.teamMemberId) {
      data.advancedroundrobin__Related_Team_Member = {
        id: availabilityData.teamMemberId,
      }
    }
    const result = await addNewRoundRobinAvailability(data);
    return result;
  }
}

export async function updateRoundRobinSetting(newData) {
  await window.ZOHO.embeddedApp.init();

  const result = await window.ZOHO.CRM.API.updateRecord({
    Entity: "advancedroundrobin__Round_Robin_Settings",
    APIData: newData,
    Trigger: ["workflow"],
  });

  await updateRoundRobinAvailability({
    ...newData,
    roundRobinSettingId: newData.id
  });

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

export async function loadRoundRobinAvailability() {
  await window.ZOHO.embeddedApp.init();
  const roundRobinAvailabilityResponse = await window.ZOHO.CRM.API.getAllRecords(
    {
      Entity: "advancedroundrobin__Round_Robin_Availability",
    }
  );

  const { data } = roundRobinAvailabilityResponse;
  return data;
}

export async function loadRoundRobinAvailabilityRecord (availabilityId) {
  await window.ZOHO.embeddedApp.init();
  const roundRobinAvailabilityResponse = await window.ZOHO.CRM.API.getRecord({
    Entity: 'advancedroundrobin__Round_Robin_Availability',
    RecordID: [availabilityId],
  });

  const { data } = roundRobinAvailabilityResponse;
  return data;
}

export async function searchForAvailabilitySetting(criteria) {
  await window.ZOHO.embeddedApp.init();

  const response = await window.ZOHO.CRM.API.searchRecord({
    Entity: 'advancedroundrobin__Round_Robin_Availability',
    Type: 'criteria',
    Query: criteria,
    page: 1,
    per_page: 200,
  });

  const { data } = response;
  return data;
}

export async function loadRoundRobinAvailabilityForRoundRobinSetting(settingId) {
  const data = await searchForAvailabilitySetting(`(advancedroundrobin__Round_Robin_Setting:equals:${settingId})`);
  return data;
}

export async function loadRoundRobinAvailabilityForTeamMember(teamMemberId) {
  const data = await searchForAvailabilitySetting(`(advancedroundrobin__Related_Team_Member:equals:${teamMemberId})`);
  return data;
}

export async function enableRoundRobinAvailability() {
  const result = await window.ZOHO.CRM.FUNCTIONS.execute(
    "advancedroundrobin__enable_availability_module",
    {}
  );
  return result?.code;
}

export async function addNewRoundRobinAvailability(data) {
  await window.ZOHO.embeddedApp.init();

  const result = await window.ZOHO.CRM.API.insertRecord({
    Entity: "advancedroundrobin__Round_Robin_Availability",
    APIData: {
      Name: "New Setting",
      ...data,
    },
    Trigger: ["workflow"],
  });

  return result.data[0];
}

export async function checkAvailabilityEnabled() {
  await window.ZOHO.embeddedApp.init();
  const result = await window.ZOHO.CRM.API.getOrgVariable(
    "advancedroundrobin__availability_enabled"
  ).then((data) => JSON.parse(data?.Success?.Content || ""));

  return result;
}

export async function getWidgetData() {
  return new Promise((resolve, reject) => {
    window.ZOHO.embeddedApp.on('PageLoad', async function (pageData) {
      const currentSelectedModule = pageData.Entity;
      const selectedRecordID = pageData.EntityId;

      if (!currentSelectedModule) {
        return resolve({
          widgetType: 'WebTab'
        });
      }

      if (pageData.ButtonPosition) {
        return resolve({
          widgetType: 'Button',
          selectedModule: currentSelectedModule,
          selectedRecordID: selectedRecordID
        });
      }

      const { data } = await window.ZOHO.CRM.API.getRecord({
        Entity: currentSelectedModule,
        RecordID: [selectedRecordID],
      })

      resolve({
        widgetType: 'RelatedList',
        selectedModule: currentSelectedModule,
        selectedRecordID: selectedRecordID,
        selectedRecordData: data?.[0]
      });
    });
    window.ZOHO.embeddedApp.init();
  });

}
