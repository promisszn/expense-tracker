<template>
  <Navbar />
  <div class="welcome">
    <img :src="require('@/assets/img/ballongirl.svg')" alt="" />
    <div class="info">
      <h2>Fundall Expense Tracker</h2>
      <p>Mini Project Frontend</p>
      <span class="by">by Olayinka Promise</span>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
  mounted() {
    if (this.$cookies.get("token")) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .info {
    margin-top: 5rem;
    text-align: center;

    h2 {
      font-size: 40px;
      line-height: 51px;
    }

    p {
      font-size: 40px;
      line-height: 51px;
      margin-top: 0.875rem;
      margin-bottom: 2.5rem;
    }

    span {
      font-size: 24px;
      line-height: 30px;
    }
  }
}
</style>
