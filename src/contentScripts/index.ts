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

function getIconStatus() {
  const overlay = document.querySelector('.MuiModal-backdrop')

  if (overlay) {
    return 'pending'
  }

  const microphone = document.querySelector('[aria-label="microphone"]')

  if (microphone) {
    return microphone.getAttribute('data-status') !== 'true' ? 'muted' : 'active'
  }

  return 'default'
}

function syncIcon() {
  sendMessage('change-icon', { status: getIconStatus() })
}

function clickIcon() {

  const status = getIconStatus()

  // 本来は instanceof HTMLButtonElement で型をチェックしたいが、ovice 側の都合で button でなくなってしまう可能性がある。
  // div になっても click させるために as HTMLBaseElement としておく。
  if (status === 'pending') {
    const overlay = document.querySelector('.MuiModal-backdrop') as HTMLBaseElement
    overlay.click()

  } else {
    const microphone = document.querySelector('[aria-label="microphone"]') as HTMLBaseElement
    microphone.click()
  }
}
