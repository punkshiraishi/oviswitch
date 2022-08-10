/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge'

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
})()
