<template>
  <q-card flat class="eg-card">
    <q-card-section class="row items-center">
      <div class="text-h6 text-weight-bold">
        {{ initial ? 'Edit restaurant info' : 'Add your restaurant' }}
      </div>
      <q-space />
      <q-btn v-if="initial" flat round dense icon="close" @click="emit('cancel')" />
    </q-card-section>
    <q-separator />

    <q-form ref="formRef" @submit.prevent="submit">
      <q-card-section class="row q-col-gutter-lg">
        <!-- Logo upload -->
        <div class="col-12 col-md-4 column items-center">
          <div class="logo-drop" @click="fileRef.pickFiles()">
            <img v-if="form.logo" :src="form.logo" alt="Restaurant logo" />
            <div v-else class="column items-center eg-muted">
              <q-icon name="add_photo_alternate" size="42px" />
              <span class="text-caption q-mt-xs">Upload logo</span>
            </div>
          </div>
          <q-file
            ref="fileRef"
            v-model="logoFile"
            accept="image/*"
            class="hidden"
            :max-file-size="MAX_LOGO"
            @rejected="onRejected"
            @update:model-value="readLogo"
          />
          <div class="row q-gutter-sm q-mt-sm">
            <q-btn
              outline
              dense
              no-caps
              color="primary"
              icon="upload"
              label="Choose"
              @click="fileRef.pickFiles()"
            />
            <q-btn
              v-if="form.logo"
              flat
              dense
              no-caps
              color="negative"
              icon="delete"
              label="Remove"
              @click="form.logo = ''"
            />
          </div>
          <div class="text-caption eg-muted q-mt-xs">PNG / JPG, max 1 MB</div>
        </div>

        <!-- Details -->
        <div class="col-12 col-md-8 row q-col-gutter-sm">
          <div class="col-12">
            <q-input
              v-model="form.name"
              outlined
              label="Restaurant name *"
              :rules="[required('Restaurant name')]"
            >
              <template #prepend><q-icon name="storefront" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.phone"
              outlined
              type="tel"
              label="Phone number *"
              :rules="[required('Phone'), phoneRule]"
            >
              <template #prepend><q-icon name="call" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="branchInput"
              outlined
              label="Branch name(s) *"
              hint="Type a branch and press Enter"
              @keydown.enter.prevent="addBranch"
            >
              <template #prepend><q-icon name="account_tree" /></template>
              <template #append>
                <q-btn round dense flat icon="add_circle" color="secondary" @click="addBranch" />
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <div class="row q-gutter-xs q-mb-sm" :class="{ 'q-mt-sm': form.branches.length }">
              <q-chip
                v-for="(b, i) in form.branches"
                :key="b"
                removable
                icon="location_on"
                class="eg-chip-soft"
                @remove="form.branches.splice(i, 1)"
              >
                {{ b }}
              </q-chip>
            </div>
            <div v-if="branchError" class="text-negative text-caption q-mb-sm">
              {{ branchError }}
            </div>
          </div>
          <div class="col-12">
            <q-input
              v-model="form.address"
              outlined
              type="textarea"
              autogrow
              label="Address *"
              :rules="[required('Address')]"
            >
              <template #prepend><q-icon name="place" /></template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn v-if="initial" flat no-caps label="Cancel" @click="emit('cancel')" />
        <q-btn
          type="submit"
          unelevated
          color="primary"
          class="eg-btn"
          :icon="initial ? 'save' : 'add_business'"
          :label="initial ? 'Update info' : 'Add restaurant'"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { required, phoneRule } from 'src/utils/validators.js'

const props = defineProps({ initial: { type: Object, default: null } })
const emit = defineEmits(['save', 'cancel'])

const $q = useQuasar()
const MAX_LOGO = 1024 * 1024

const formRef = ref(null)
const fileRef = ref(null)
const logoFile = ref(null)
const branchInput = ref('')
const branchError = ref('')

const form = reactive({
  name: props.initial?.name || '',
  logo: props.initial?.logo || '',
  address: props.initial?.address || '',
  phone: props.initial?.phone || '',
  branches: [...(props.initial?.branches || [])],
})

function addBranch() {
  const name = branchInput.value.trim()
  if (!name) return
  if (form.branches.some((b) => b.toLowerCase() === name.toLowerCase())) {
    branchError.value = 'This branch is already added'
    return
  }
  form.branches.push(name)
  branchInput.value = ''
  branchError.value = ''
}

function readLogo(file) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.logo = reader.result
    logoFile.value = null
  }
  reader.readAsDataURL(file)
}

function onRejected() {
  $q.notify({ type: 'warning', message: 'Please choose an image smaller than 1 MB' })
}

async function submit() {
  // a branch typed but not yet added still counts
  if (branchInput.value.trim()) addBranch()

  const ok = await formRef.value.validate()
  if (!form.branches.length) branchError.value = 'Add at least one branch'
  if (!ok || !form.branches.length) return

  emit('save', { ...form, branches: [...form.branches] })
}
</script>

<style scoped lang="scss">
.logo-drop {
  width: 150px;
  height: 150px;
  border-radius: 24px;
  border: 2px dashed rgba(30, 111, 80, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  background: rgba(30, 111, 80, 0.04);
  transition: border-color 0.2s;
  &:hover {
    border-color: var(--eg-ember);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
