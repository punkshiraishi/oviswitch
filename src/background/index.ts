import browser from 'webextension-polyfill'
import { onMessage, sendMessage } from 'webext-bridge'
import { validUrl } from '~/logic/url'

// ovice に移動する直前のタブを知りたいので tab を移動するたびにここに保存しておく。
const store = {
  previousTabId: 0,
  windowId: 0,
}

browser.storage.onChanged.addListener(async (changes) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key === 'workspace') {
      if (validUrl(newValue)) {
        await browser.action.setPopup({ popup: '' })

      } else {
        await browser.action.setPopup({ popup: './dist/popup/index.html' })
      }
    }
  }
});

(async () => {
  const { workspace } = await browser.storage.local.get('workspace')

  if (validUrl(workspace)) {
    await browser.action.setPopup({ popup: '' })

  } else {
    await browser.action.setPopup({ popup: './dist/popup/index.html' })
  }
})()

browser.action.onClicked.addListener(async () => {
  await excuteMain()
})

browser.commands.onCommand.addListener(async (command) => {
  if (command === 'execute_main') {
    await excuteMain()
  }

  if (command === 'back_to_previous') {
    await backToPrevious()
  }
})

async function excuteMain() {
  const [currentTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true })

  if (currentTab.url?.includes('ovice.in')) {
    if (currentTab.id) {
      await sendMessage('click-icon', undefined, { context: 'content-script', tabId: currentTab.id })
    }

    return
  }

  const tabs = await browser.tabs.query({ url: '*://*.ovice.in/*' })

  if (tabs.length > 0) {
    if (tabs[0].url?.includes('ovice.in')) {
      await browser.tabs.update(tabs[0].id, { active: true })

      if (tabs[0].windowId) {
        await browser.windows.update(tabs[0].windowId, { focused: true })
      }
    }

    return
  }

  const { workspace } = await browser.storage.local.get('workspace')

  if (validUrl(workspace)) {
    browser.tabs.create({ url: workspace })
  }
}

browser.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  const tab = await browser.tabs.get(tabId)

  if (tab.url?.includes('ovice.in')) {
    await sendMessage('check-muted', undefined, { context: 'content-script', tabId })

  } else {
    browser.action.setIcon({ path: '/assets/black16.png' })

    // ovice に移動する直前のタブを知りたいので常に ovice 以外の tab ID を保存しておく
    store.previousTabId = tabId
    store.windowId = windowId
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

async function backToPrevious() {
  const [currentTab] = await browser.tabs.query({ active: true, lastFocusedWindow: true })

  if (currentTab.url?.includes('ovice.in') && store.previousTabId) {
    await browser.tabs.update(store.previousTabId, { active: true })

    if (store.windowId) {
      await browser.windows.update(store.windowId, { focused: true })
    }
  }
}
