<template>
  <q-card class="auth-card eg-card q-pa-md">
    <q-card-section class="row items-center no-wrap">
      <q-btn flat round dense icon="arrow_back" @click="emit('back')">
        <q-tooltip>Back to login</q-tooltip>
      </q-btn>
      <div class="q-ml-sm">
        <div class="text-h5 text-weight-bold">Create account</div>
        <div class="eg-muted">Register to manage your restaurant</div>
      </div>
      <q-space />
      <q-avatar size="48px" class="eg-ember-gradient"><q-icon name="person_add" /></q-avatar>
    </q-card-section>

    <q-form ref="formRef" class="q-px-md" @submit.prevent="submit">
      <div class="row q-col-gutter-sm">
        <div class="col-12">
          <q-input
            v-model="form.name"
            outlined
            label="Full name"
            :rules="[required('Name')]"
            lazy-rules
          >
            <template #prepend><q-icon name="badge" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="form.email"
            outlined
            type="email"
            label="Email"
            :rules="[required('Email'), emailRule]"
            lazy-rules
          >
            <template #prepend><q-icon name="alternate_email" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="form.phone"
            outlined
            type="tel"
            label="Phone"
            :rules="[required('Phone'), phoneRule]"
            lazy-rules
          >
            <template #prepend><q-icon name="smartphone" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="form.password"
            outlined
            type="password"
            label="Password"
            :rules="[required('Password'), minLength(6)]"
            lazy-rules
          >
            <template #prepend><q-icon name="key" /></template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="form.confirm"
            outlined
            type="password"
            label="Confirm password"
            :rules="[required('Confirm password'), matchPassword]"
            lazy-rules
          >
            <template #prepend><q-icon name="verified_user" /></template>
          </q-input>
        </div>
      </div>

      <q-btn
        type="submit"
        unelevated
        color="secondary"
        size="lg"
        class="full-width eg-btn q-mt-sm"
        label="Register"
        icon="how_to_reg"
        :loading="loading"
      />
    </q-form>

    <q-card-section class="text-center">
      <span class="eg-muted">Already have an account?</span>
      <q-btn
        flat
        no-caps
        color="primary"
        class="text-weight-bold"
        label="Login"
        @click="emit('back')"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth.js'
import { required, emailRule, phoneRule, minLength } from 'src/utils/validators.js'

const emit = defineEmits(['back', 'registered'])

const $q = useQuasar()
const auth = useAuthStore()

const formRef = ref(null)
const loading = ref(false)
const form = reactive({ name: '', email: '', phone: '', password: '', confirm: '' })

const matchPassword = (v) => v === form.password || 'Passwords do not match'

async function submit() {
  const ok = await formRef.value.validate()
  if (!ok) return

  loading.value = true
  try {
    const email = await auth.register(form)
    $q.notify({ type: 'positive', message: 'Account created! Please log in.' })
    emit('registered', email)
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
  max-width: 560px;
}
</style>
