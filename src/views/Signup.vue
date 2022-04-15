<template>
  <div class="main">
    <router-link :to="{ name: 'welcome' }">
      <img class="logo" :src="require('@/assets/img/fundall.svg')" alt=""
    /></router-link>
    <div class="container">
      <div class="lhs">
        <img :src="require('@/assets/img/ballongirl.svg')" alt="" />
        <h2>
          <span>Welcome! </span>Let’s get <br />
          to know you.
        </h2>
        <p>
          Your first step toward a better financial <br />
          lifestyle starts here.
        </p>
      </div>

      <div class="rhs">
        <div class="signup-form">
          <form @submit.prevent="handleSubmit">
            <div class="name">
              <div class="control-group">
                <label for="firstname">First Name </label>
                <input
                  type="text"
                  id="firstname"
                  placeholder="Enter First Name"
                  v-model="user.firstName"
                />
                <div
                  v-show="
                    submitted && !v$.user.firstName.error && !user.firstName
                  "
                  class="invalid-feedback"
                >
                  First Name is required
                </div>
              </div>
              <div class="divider"></div>
              <div class="control-group">
                <label for="lastname">Last Name </label>
                <input
                  type="text"
                  id="lastname"
                  placeholder="Enter Last Name"
                  v-model="user.lastName"
                />
                <div
                  v-show="
                    submitted && !v$.user.lastName.error && !user.lastName
                  "
                  class="invalid-feedback"
                >
                  Last Name is required
                </div>
              </div>
            </div>

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
                name="password"
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

            <div class="control-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                v-model="user.confirmPassword"
              />
              <div
                v-if="submitted && v$.user.confirmPassword.$error"
                class="invalid-feedback"
              >
                <span
                  v-if="v$.user.confirmPassword.$error && !user.confirmPassword"
                  >Confirm Password is required</span
                >
                <span
                  v-else-if="
                    v$.user.confirmPassword.sameAsPassword &&
                    user.confirmPassword
                  "
                  >Passwords must match</span
                >
              </div>
            </div>
            <div class="error" v-if="error">{{ error }}</div>
            <button v-if="!isUploading">SIGN UP</button>
            <button v-else class="loader">
              <div class="loader"></div>
            </button>
          </form>
          <p>
            Already have an account?
            <router-link class="login" :to="{ name: 'login' }"
              >Login Here</router-link
            >
          </p>
        </div>
        <div class="terms">
          By clicking on Login, you agree to our
          <router-link to="#"
            >Terms & <br />Conditions and Privacy Policy</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";

export default {
  name: "app",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },

  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      submitted: false,
      error: null,
      isUploading: false,
    };
  },
  validations() {
    return {
      user: {
        firstName: { required },
        lastName: { required },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        confirmPassword: {
          required,
          sameAsPassword: sameAs(this.user.password),
        },
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
      this.isUploading = true;
      const user = {
        firstname: this.user.firstName,
        lastname: this.user.lastName,
        email: this.user.email,
        password: this.user.password,
        password_confirmation: this.user.confirmPassword,
      };

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      let response;
      try {
        response = await axios.post(
          "https://campaign.fundall.io/api/v1/register",
          user,
          { headers }
        );
      } catch (e) {
        this.error = e.response.data.error.message;
        this.isUploading = false;
      }

      if (response) {
        this.$router.push({ name: "login" });
        this.isUploading = false;
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
  justify-content: space-between;
  margin: 0 6rem;

  @media (max-width: 1000px) {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 700px) {
    margin: 0 2rem;
  }

  @media (max-width: 375px) {
    margin: 0 1rem;
  }

  .lhs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (max-width: 1000px) {
      display: none;
    }

    img {
      width: 50%;
    }

    h2 {
      margin-top: 4rem;
      margin-bottom: 2rem;
      font-weight: 800;
      font-size: 40px;
      line-height: 51px;

      span {
        color: $mint-green;
      }
    }

    p {
      font-size: 21px;
      line-height: 27px;
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
      padding: 2rem 5rem;

      @media (max-width: 1150px) {
        margin-top: 0;
      }

      @media (max-width: 560px) {
        padding: 4rem 2rem;
      }

      @media (max-width: 375px) {
        padding: 4rem 0.5rem;
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

        .name {
          width: 100%;
          display: flex;
          justify-content: space-between;

          input {
            width: 100%;
            padding: 15px 0 15px 15px;
          }

          .divider {
            width: 2rem;
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
    }

    .terms {
      margin-top: 2rem;
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
</style>
