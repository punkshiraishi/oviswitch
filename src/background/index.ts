import browser from 'webextension-polyfill'

browser.action.onClicked.addListener(async () => {
  const tabs = await browser.tabs.query({ url: '*://*.ovice.in/*' })

  if (tabs.length === 0) {
    return
  }

  if (tabs[0].url?.includes('ovice.in')) {
    await browser.tabs.update(tabs[0].id, { active: true })

    if (tabs[0].windowId) {
      await browser.windows.update(tabs[0].windowId, { focused: true })
    }
  }
})
