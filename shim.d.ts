import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {

    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'check-muted': undefined
    'click-icon': undefined
    'change-icon': { status: 'pending' | 'muted' | 'active' | 'default' }
    'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>
  }
}
