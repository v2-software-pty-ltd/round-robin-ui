export async function getCurrentUserData() {
  await window.ZOHO.embeddedApp.init();

  const currentUserData = await window.ZOHO.CRM.CONFIG.getCurrentUser();

  return currentUserData?.users?.[0];
}
