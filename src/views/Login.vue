<template>
  <div class="main">
    <router-link :to="{ name: 'welcome' }">
      <img class="logo" :src="require('@/assets/img/fundall.svg')" alt=""
    /></router-link>
    <div class="container">
      <div class="lhs">
        <img :src="require('@/assets/img/flowergirl.svg')" alt="" />
        <h2>Welcome back!</h2>
        <p>We miss you.</p>
      </div>

      <div class="rhs">
        <div class="signup-form">
          <div class="holla">Holla</div>
          <div class="vibe">Sign in to the vibe!</div>
          <form @submit.prevent="handleSubmit">
            <div class="control-group">
              <label for="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                v-model="user.email"
              />
              <div
                v-show="submitted && v$.user.email.$error"
                class="invalid-feedback"
              >
                <span v-show="v$.user.email.$error && !user.email"
                  >Email is required</span
                >
                <span v-show="v$.user.email.email && user.email"
                  >Email is invalid</span
                >
              </div>
            </div>

            <div class="control-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                v-model="user.password"
              />
              <div
                v-if="submitted && v$.user.password.$error"
                class="invalid-feedback"
              >
                <span v-if="v$.user.password.$error && !user.password"
                  >Password is required</span
                >
                <span v-if="v$.user.password.minLength && user.password"
                  >Password must be at least 6 characters</span
                >
              </div>
            </div>

            <div class="error" v-if="error">{{ error }}</div>
            <button v-if="!isUploading">LOGIN</button>
            <button v-else class="loader">
              <div class="loader"></div>
            </button>
          </form>
          <p>
            Don’t have an account?
            <router-link class="login" :to="{ name: 'signup' }"
              >Register Here</router-link
            >
          </p>

          <div class="terms">
            By clicking on Login, you agree to our
            <router-link to="#"
              >Terms & <br />Conditions and Privacy Policy</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },

  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      submitted: false,
      error: null,
      isUploading: false,
    };
  },
  validations() {
    return {
      user: {
        email: { required, email },
        password: { required, minLength: minLength(6) },
      },
    };
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      this.isUploading = true;

      // stop here if form is invalid
      this.v$.$touch();
      if (this.v$.$invalid) {
        this.isUploading = false;
        return;
      }
      this.signUp();
    },

    async signUp() {
      this.error = null;
      this.isUploading = true;
      const user = {
        email: this.user.email,
        password: this.user.password,
      };

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      let response;
      try {
        response = await axios.post(
          "https://campaign.fundall.io/api/v1/login",
          user,
          { headers }
        );
      } catch (e) {
        if (!e.response) {
          this.$toast.error("Network Error! Please Try Again", {
            position: "top",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.isUploading = false;
          return;
        }
        this.error = e.response.data.error.message;
        this.isUploading = false;
      }

      if (response) {
        this.$cookies.set(
          "token",
          response.data.success.user.access_token,
          "5h"
        );
        this.$router.push({ name: "home" });
      }
    },
  },

  mounted() {
    if (this.$cookies.get("token")) {
      this.$router.push({ name: "home" });
    }
  },
};
</script>

<style lang="scss" scoped>
.logo {
  margin: 2rem;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 6rem;

  @media (max-width: 690px) {
    margin: 0;
  }

  .lhs {
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 945px) {
      display: none;
    }

    h2,
    p {
      font-weight: 800;
      font-size: 40px;
      line-height: 51px;
    }

    h2 {
      margin-top: 2rem;
      margin-bottom: 0.5rem;
      color: $mint-green;
    }
  }

  .rhs {
    display: flex;
    flex-direction: column;

    .signup-form {
      display: flex;
      flex-direction: column;
      margin-top: -4rem;
      background: #ffffff;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.082937);
      border-radius: 6px;
      padding: 4rem 5rem;

      @media (max-width: 945px) {
        margin-top: 0;
      }

      @media (max-width: 690px) {
        padding: 4rem 2rem;
      }

      .holla {
        font-size: 34px;
        line-height: 43px;
        color: #1b2420;
      }

      .vibe {
        font-size: 20px;
        line-height: 25px;
        color: $dark-green;
        margin-top: 0.5rem;
        margin-bottom: 2rem;
      }

      form {
        display: flex;
        flex-direction: column;

        input,
        label {
          display: block;
        }

        label {
          font-size: 16px;
          line-height: 20px;
          font-weight: 600;
        }

        input {
          width: 100%;
          margin-bottom: 1.5rem;
          outline: none;
          @include input;

          &:focus {
            border: 1px solid $mint-green;
          }
        }

        .control-group {
          &:focus-within {
            label {
              color: $mint-green;
            }
          }
        }

        button {
          @include btn;
          display: flex;
          align-items: center;
          justify-content: center;

          .loader {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            border-top: none;
            border-right: none;
            animation: spin 1s linear infinite;

            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          }
        }

        .invalid-feedback {
          font-size: 14px;
          position: relative;
          bottom: 20px;
          color: #dc3545;
        }

        .error {
          text-align: center;
          font-size: 14px;
          color: #dc3545;
        }
      }

      p {
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        margin-top: 2rem;
        text-align: center;

        .login {
          color: $mint-green;
          font-weight: 700;
        }
      }

      .terms {
        margin-top: 1rem;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: #97a19d;

        a {
          color: $mint-green;
        }
      }
    }
  }
}
</style>
