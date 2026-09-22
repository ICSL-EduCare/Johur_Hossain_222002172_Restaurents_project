<template>
  <q-page class="login-page row">
    <!-- Brand panel (desktop only) -->
    <div class="col-md-6 gt-sm brand-panel column justify-between q-pa-xl">
      <div class="row items-center q-gutter-sm">
        <q-icon name="local_fire_department" size="34px" color="accent" />
        <span class="text-h6 text-weight-bold">The EmberGrill</span>
      </div>

      <div>
        <div class="text-h3 text-weight-bold brand-headline">
          Fresh from the fire,<br />grilled to perfection.
        </div>
        <p class="text-subtitle1 q-mt-md brand-copy">
          Restaurant management &amp; retail POS &mdash; menu, orders and invoices in one place.
        </p>
        <div class="row q-gutter-sm q-mt-lg">
          <q-chip
            v-for="f in features"
            :key="f.label"
            :icon="f.icon"
            class="brand-chip"
            text-color="white"
          >
            {{ f.label }}
          </q-chip>
        </div>
      </div>

      <div class="text-caption brand-copy">
        &copy; {{ year }} The EmberGrill &middot; Vue 3 + Quasar
      </div>
    </div>

    <!-- Auth card area: Login and Register swap here, the route never changes -->
    <div class="col-12 col-md-6 flex flex-center q-pa-md auth-area">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <RegisterCard
          v-if="mode === 'register'"
          key="register"
          @back="mode = 'login'"
          @registered="onRegistered"
        />
        <LoginCard v-else key="login" :prefill-email="lastEmail" @register="mode = 'register'" />
      </transition>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import LoginCard from 'components/auth/LoginCard.vue'
import RegisterCard from 'components/auth/RegisterCard.vue'

const mode = ref('login') // 'login' | 'register'
const lastEmail = ref('')
const year = new Date().getFullYear()

const features = [
  { icon: 'restaurant_menu', label: 'Menu items' },
  { icon: 'point_of_sale', label: 'Quick orders' },
  { icon: 'receipt_long', label: 'Invoices' },
]

// Activity diagram: after registration the user goes back to the login card
function onRegistered(email) {
  lastEmail.value = email
  mode.value = 'login'
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
}
.brand-panel {
  color: #fff;
  /* plated food photo behind the brand text */
  background:
    radial-gradient(circle at 10% 90%, rgba(232, 112, 42, 0.45), transparent 45%),
    linear-gradient(
      160deg,
      rgba(15, 58, 42, 0.93) 0%,
      rgba(30, 111, 80, 0.78) 60%,
      rgba(44, 143, 103, 0.55) 100%
    ),
    url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=75')
      center / cover no-repeat;
}
.brand-headline {
  line-height: 1.15;
}
.brand-copy {
  opacity: 0.8;
  max-width: 440px;
}
.brand-chip {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
/* restaurant dining room behind the Login / Register card */
.auth-area {
  background:
    linear-gradient(180deg, rgba(242, 245, 243, 0.82), rgba(242, 245, 243, 0.68)),
    url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=75')
      center / cover no-repeat;
}
.body--dark .auth-area {
  background:
    linear-gradient(180deg, rgba(14, 21, 18, 0.88), rgba(14, 21, 18, 0.74)),
    url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=75')
      center / cover no-repeat;
}
@media (max-width: 1023px) {
  .auth-area {
    min-height: 100vh;
    background:
      linear-gradient(160deg, rgba(15, 58, 42, 0.9), rgba(30, 111, 80, 0.7)),
      url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=75')
        center / cover no-repeat;
  }
}
</style>
