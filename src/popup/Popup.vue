<script setup lang="ts">
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <p class="mt-2 opacity-80">
      <b>oVice ワークスペース URL</b> を設定すれば、<br>
      このアイコンから oVice を開く事ができます。
    </p>
    <button class="btn mt-2" @click="openOptionsPage">
      設定画面へ
    </button>
  </main>
</template>

