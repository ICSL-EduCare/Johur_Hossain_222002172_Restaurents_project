<template>
  <q-card class="auth-card eg-card q-pa-md">
    <q-card-section class="text-center">
      <q-avatar size="64px" class="eg-gradient">
        <q-icon name="lock_open" size="30px" />
      </q-avatar>
      <div class="text-h5 text-weight-bold q-mt-md">Welcome back</div>
      <div class="eg-muted">Sign in to open your restaurant POS</div>
    </q-card-section>

    <q-form ref="formRef" class="q-px-md q-gutter-y-sm" @submit.prevent="submit">
      <q-input
        v-model="form.email"
        outlined
        type="email"
        label="Email"
        autocomplete="username"
        :rules="[required('Email'), emailRule]"
        lazy-rules
      >
        <template #prepend><q-icon name="alternate_email" /></template>
      </q-input>

      <q-input
        v-model="form.password"
        outlined
        :type="showPass ? 'text' : 'password'"
        label="Password"
        autocomplete="current-password"
        :rules="[required('Password')]"
        lazy-rules
      >
        <template #prepend><q-icon name="key" /></template>
        <template #append>
          <q-icon
            :name="showPass ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPass = !showPass"
          />
        </template>
      </q-input>

      <q-btn
        type="submit"
        unelevated
        color="primary"
        size="lg"
        class="full-width eg-btn q-mt-md"
        label="Login"
        icon-right="arrow_forward"
        :loading="loading"
      />
    </q-form>

    <q-card-section class="text-center q-pt-lg">
      <span class="eg-muted">New to The EmberGrill?</span>
      <q-btn
        flat
        no-caps
        color="secondary"
        class="text-weight-bold"
        label="Register"
        icon="person_add"
        @click="emit('register')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.js'
import { required, emailRule } from 'src/utils/validators.js'

const props = defineProps({ prefillEmail: { type: String, default: '' } })
const emit = defineEmits(['register'])

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const formRef = ref(null)
const form = reactive({ email: props.prefillEmail, password: '' })
const showPass = ref(false)
const loading = ref(false)

watch(
  () => props.prefillEmail,
  (v) => (form.email = v),
)

async function submit() {
  const ok = await formRef.value.validate()
  if (!ok) return

  loading.value = true
  try {
    const user = await auth.login(form.email, form.password)
    $q.notify({ type: 'positive', icon: 'waving_hand', message: `Welcome, ${user.name}!` })
    router.replace({ name: 'restaurant' })
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 420px;
}
</style>
