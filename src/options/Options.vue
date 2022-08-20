<script setup lang="ts">
import { workspace } from '~/logic/storage'
import { validUrl } from '~/logic/url'

const valid = computed(() => {
  return validUrl(workspace.value)
})

const empty = computed(() => !workspace.value)

function openWorkspace() {
  window.open(workspace.value, '_blank')
}
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-2xl" alt="extension icon">
    <div class="flex flex-col justify-start items-center">
      <div>Options</div>
      <p class="mt-2">
        oVice ワークスペース URL
      </p>
      <input
        v-model="workspace"
        type="url"
        class="border border-gray-400 rounded outline-none px-2 py-1 mt-2 w-20rem"
        :class="[
          !empty && !valid && 'border-red-400',
        ]"
      >
      <div v-if="!empty && !valid" class="text-red-400">
        有効な oVice ワークスペース URL を入力してください
      </div>
      <button v-if="!empty && valid" class="btn mt-2" @click="openWorkspace">
        ワークスペースを開く
      </button>
    </div>
  </main>
</template>
