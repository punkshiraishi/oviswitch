/* eslint-disable no-console */
import { onMessage, sendMessage } from 'webext-bridge'

onMessage('click-icon', () => {
  clickIcon()
})

onMessage('check-muted', () => {
  syncIcon()
})

const observer = new MutationObserver(() => {
  syncIcon()
})

observer.observe(document, { childList: true, subtree: true })

function syncIcon() {
  const microphone = document.querySelector('[aria-label="microphone"]')

  if (microphone) {
    const muted = microphone.getAttribute('data-status') !== 'true'
    sendMessage('change-icon', { muted })
  }
}

function clickIcon() {

  // 本来は instanceof HTMLButtonElement で型をチェックしたいが、ovice 側の都合で button でなくなってしまう可能性がある。
  // div になっても click させるために as HTMLBaseElement としておく。
  const microphone = document.querySelector('[aria-label="microphone"]') as HTMLBaseElement
  microphone.click()
}
