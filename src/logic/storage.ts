import { useStorageLocal } from '~/composables/useStorageLocal'

export const workspace = useStorageLocal('workspace', '', { listenToStorageChanges: true })
