<template>
  <div class="main">
    <router-link :to="{ name: 'welcome' }">
      <img class="logo" :src="require('@/assets/img/fundall.svg')" alt=""
    /></router-link>

    <button class="logout" @click="logout">Logout</button>

    <div class="home">
      <div class="lhs">
        <div class="user-details">
          <div class="avatar">
            <input
              type="file"
              name="myImage"
              @change="uploadImage"
              accept="image/*"
            />
            <img
              v-if="!user.avatar"
              :src="require('@/assets/img/user.svg')"
              alt=""
            />
            <img
              v-if="user.avatar"
              class="avatar-image"
              :src="user.avatar"
              alt=""
            />
          </div>
          <div class="info">
            <div class="name">{{ user.firstname }} {{ user.lastname }}</div>
            <div class="email">{{ user.email }}</div>
          </div>
        </div>

        <div class="target">
          <div class="title">Target Monthly Expenses</div>
          <div class="amount">₦{{ user.total_balance }}</div>
          <div class="progress">
            <div class="progress-bar"></div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-title">Daily Expenses Summary</div>
          <table>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
            <tr v-show="showExpenses">
              <td class="dot">
                <img :src="require('@/assets/img/dot.svg')" alt="" />
              </td>
              <td>30 Nov, 2018</td>
              <td>₦30,000</td>
            </tr>
            <div class="divider"></div>
            <tr v-show="showExpenses">
              <td class="dot">
                <img :src="require('@/assets/img/dot.svg')" alt="" />
              </td>
              <td>30 Nov, 2018</td>
              <td>₦30,000</td>
            </tr>
            <div class="divider"></div>
            <tr v-show="showExpenses">
              <td class="dot">
                <img :src="require('@/assets/img/dot.svg')" alt="" />
              </td>
              <td>30 Nov, 2018</td>
              <td>₦30,000</td>
            </tr>
          </table>
          <div class="artwork" v-show="!showExpenses">
            <img :src="require('@/assets/img/artwork.svg')" alt="" />
          </div>
        </div>
      </div>

      <div class="rhs">
        <div class="banner">
          <div class="banner-info">
            <div class="welcome">
              <span>Welcome back,</span> {{ user.firstname }}
            </div>
            <div class="sub">Now, let’s get your expenses for this month</div>
          </div>

          <img :src="require('@/assets/img/skater.svg')" alt="" />
        </div>

        <div class="target-input">
          <div class="target">
            <label for="target">Target Monthly Expenses</label>
            <input type="text" v-model="user.total_balance" />
          </div>
          <div class="date">
            <label for="date">Date</label>
            <input type="date" id="date" />
          </div>
        </div>

        <div class="expense-input">
          <div class="today">Today’s Expenses</div>
          <form action="">
            <div class="control-group">
              <div class="control">
                <input
                  type="text"
                  placeholder="Enter item"
                  v-model="items[0].name"
                />
                <div class="gap"></div>
                <input
                  type="text"
                  placeholder="Amount"
                  v-model="items[0].amount"
                />
              </div>

              <div class="control">
                <input
                  type="text"
                  placeholder="Enter item"
                  v-model="items[1].name"
                />
                <div class="gap"></div>
                <input
                  type="text"
                  placeholder="Amount"
                  v-model="items[1].amount"
                />
              </div>

              <div class="control">
                <input
                  type="text"
                  placeholder="Enter item"
                  v-model="items[2].name"
                />
                <div class="gap"></div>
                <input
                  type="text"
                  placeholder="Amount"
                  v-model="items[2].amount"
                />
              </div>
            </div>
            <div class="total">
              Total Actual Expenses: ₦
              <input type="text" v-model="totalAmount" />
            </div>
            <div class="save">
              <button class="btn" @click.prevent="save">
                SAVE TODAY’S EXPENSES
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      showExpenses: true,
      token: null,
      error: null,
      user: [],
      avatar: false,
      target: 0,

      items: [
        {
          id: 1,
          name: "",
          amount: 0,
        },
        {
          id: 2,
          name: "",
          amount: 0,
        },
        {
          id: 3,
          name: "",
          amount: 0,
        },
      ],
      totalAmount: 0,
    };
  },

  watch: {
    items: {
      handler() {
        this.totalAmount =
          parseInt(this.items[0].amount) +
          parseInt(this.items[1].amount) +
          parseInt(this.items[2].amount);
      },
      deep: true,
    },
  },

  methods: {
    save() {
      this.$toast.error("Error", {
        position: "top",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },

    logout() {
      this.$cookies.keys().forEach((cookie) => this.$cookies.remove(cookie));
      this.$router.push({ name: "login" });
    },

    async uploadImage(e) {
      let img = e.target.files[0];
      let fd = new FormData();

      fd.append("avatar", img);

      // axios.post("/upload-image", fd).then((resp) => {
      //   this.imagePath = resp.data.path;
      // });

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.token}`,
      };

      let response;
      try {
        response = await axios.post(
          "https://campaign.fundall.io/api/v1/base/avatar",
          fd,
          { headers }
        );
      } catch (e) {
        console.log(e.response);
        // this.error = e.response.data.error.message;
      }

      if (response) {
        console.log(response.data);
        window.location.reload();
      }
    },

    async getUser() {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      };

      let response;
      try {
        response = await axios.get(
          "https://campaign.fundall.io/api/v1/base/profile",
          { headers }
        );
      } catch (e) {
        console.log(e.response.data.error.message);
        this.error = e.response.data.error.message;
      }

      if (response) {
        console.log(response.data.success.data);
        this.user = response.data.success.data;
        // console.log(this.user.id);
      }
    },
  },

  mounted() {
    if (!this.$cookies.get("token")) {
      this.$router.push({ name: "login" });
    }
  },

  created() {
    this.token = this.$cookies.get("token");
    this.getUser();
  },
};
</script>

<style lang="scss" scoped>
.logo {
  margin: 2rem;
}

.logout {
  @include btn;
  position: absolute;
  top: 2rem;
  right: 2rem;
}

.home {
  display: flex;
  justify-content: space-between;
  margin: 0 2rem;
  margin-bottom: 2rem;

  .lhs {
    width: 40%;
    display: flex;
    flex-direction: column;

    .user-details {
      display: flex;
      align-items: flex-end;

      .avatar {
        width: 93px;
        height: 89px;
        background: #c4c4c4;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        & > [type="file"] {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          z-index: 10;
          cursor: pointer;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 20px;
        }
      }

      .info {
        margin-left: 2rem;
        .name {
          font-weight: 700;
          font-size: 28px;
          line-height: 35px;
          color: $dark-green;
        }

        .email {
          font-weight: 600;
          font-size: 16px;
          line-height: 27px;
          color: $dark-green;
        }
      }
    }

    .target {
      margin: 2rem 0;

      .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 27px;
        color: $dark-green;
      }

      .amount {
        font-weight: 700;
        font-size: 28px;
        line-height: 35px;
        color: $dark-green;
      }

      .progress {
        margin-top: 2rem;
        width: 75%;
        height: 7px;
        background: #c4c4c4;
        border-radius: 20px;
        position: relative;

        .progress-bar {
          width: 30%;
          height: 7px;
          background: $mint-green;
          border-radius: 20px;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }

    .summary {
      padding: 1rem;
      padding-bottom: 2rem;
      background: #ffffff;
      width: 75%;
      box-shadow: 0px 0px 6px rgba(77, 232, 151, 0.19);
      border-radius: 10px;

      .summary-title {
        font-size: 14px;
        line-height: 18px;
        font-weight: 600;
        color: #30443c;
        margin-bottom: 1.5rem;
      }

      table {
        width: 100%;

        tr {
          height: 3rem;
        }

        th {
          text-align: left;
          font-weight: 600;
          font-size: 16px;
          line-height: 22px;
          color: #30443c;
        }

        .dot {
          padding-left: 0.5rem;
        }

        .divider {
          display: block;
          height: 1rem;
        }
      }

      .artwork {
        text-align: center;
      }
    }
  }

  .rhs {
    width: 60%;
    margin-top: -4rem;
    padding: 3rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f2f3f7;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.082937);
    border-radius: 6px;

    .banner {
      padding: 2rem 1rem;
      background: #ffffff;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.082937);
      border-radius: 6px;
      display: flex;
      position: relative;
      width: 100%;
      height: 6.5rem;

      .welcome {
        font-weight: 800;
        font-size: 22px;
        line-height: 28px;

        span {
          color: $mint-green;
        }
      }

      .sub {
        font-size: 15px;
        line-height: 18px;
        color: #30443c;
      }

      img {
        position: absolute;
        bottom: 13.5px;
        right: 1rem;
      }
    }

    .target-input {
      width: 100%;
      margin: 2rem 0;
      display: flex;
      flex-direction: column;

      label,
      input {
        display: block;
        font-weight: 600;
      }

      input {
        width: 70%;
        outline: none;
        margin-bottom: 1.5rem;
        @include input;

        &:focus {
          border: 1px solid $mint-green;
        }
      }
    }

    .expense-input {
      width: 100%;

      .today {
        font-weight: 600;
        color: #30443c;
        margin-bottom: 0.5rem;
      }

      form {
        width: 100%;

        .control-group {
          display: flex;
          flex-direction: column;

          .control {
            display: flex;
            justify-content: space-between;

            input {
              width: 100%;
              outline: none;
              margin-bottom: 1.5rem;
              @include input;

              &:focus {
                border: 1px solid $mint-green;
              }
            }

            .gap {
              width: 4rem;
            }
          }
        }

        .total {
          text-align: right;
          font-weight: 700;

          input {
            @include input;
            outline: none;

            &:focus {
              border: 1px solid $mint-green;
            }
          }
        }

        .save {
          display: flex;
          align-items: center;
          justify-content: center;

          .btn {
            @include btn;
            padding: 10px 15px;
            margin: 2rem 0;
            border-radius: 15px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
