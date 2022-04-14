<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fcfbfc;
}

.main {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
</style>
