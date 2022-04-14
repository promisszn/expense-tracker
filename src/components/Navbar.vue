<template>
  <header>
    <nav class="main">
      <router-link :to="{ name: 'welcome' }" class="logo">
        <img :src="require('@/assets/img/fundall.svg')" alt=""
      /></router-link>

      <!-- buttons -->
      <div class="links">
        <router-link :to="{ name: 'login' }" class="link login"
          >LOG IN</router-link
        >
        <router-link :to="{ name: 'signup' }" class="link signup"
          >SIGN UP</router-link
        >
      </div>
    </nav>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
header {
  margin: 2rem 5rem;

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .links {
      .link {
        font-weight: 700;
        font-size: 18px;
        line-height: 23px;
        color: $black;

        &.login {
          margin-right: 1rem;
          &:hover {
            color: lighten($black, 50);
          }
        }

        &.signup {
          background: $mint-green;
          border-radius: 10px;
          padding: 0.5rem 0.5rem;

          &:hover {
            color: lighten($black, 50);
            background: lighten($mint-green, 10);
          }
        }
      }
    }
  }
}
</style>
