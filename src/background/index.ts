import browser from 'webextension-polyfill'
import { onMessage, sendMessage } from 'webext-bridge'

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

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await browser.tabs.get(tabId)

  if (tab.url?.includes('ovice.in')) {
    await sendMessage('check-muted', undefined, { context: 'content-script', tabId })
  }
})

onMessage('change-icon', ({ data }) => {
  const { muted } = data

  if (muted) {
    browser.action.setIcon({ path: '/assets/red16.png' })

  } else {
    browser.action.setIcon({ path: '/assets/blue16.png' })
  }
})
