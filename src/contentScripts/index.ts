/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge'
import { createApp } from 'vue'
import App from './views/App.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {

  onMessage('click-microphone', () => {
    console.log('hello')
  })

  const observer = new MutationObserver(() => {
    console.log('changed')
    const microphone = document.querySelector('[aria-label="microphone"]')

    if (microphone) {
      const muted = microphone.getAttribute('data-status') !== 'true'
      sendMessage('change-icon', { muted })
    }
  })

  observer.observe(document, { childList: true, subtree: true })

  // アイコンボタンがクリックされたとき → ここで listener を埋め込む
  // にミュート状態取得 アイコン変更処理 → アイコン変更は background にメッセージ送信をして行う

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  createApp(App).mount(root)
})()
