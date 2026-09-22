<template>
  <q-card flat class="eg-card overflow-hidden">
    <div class="profile-banner" />
    <q-card-section class="row items-end q-col-gutter-md profile-body">
      <div class="col-auto">
        <q-avatar size="104px" class="profile-logo" rounded>
          <img v-if="profile.logo" :src="profile.logo" alt="logo" />
          <q-icon v-else name="storefront" size="52px" color="primary" />
        </q-avatar>
      </div>
      <div class="col">
        <div class="text-h5 text-weight-bold">{{ profile.name }}</div>
        <div class="eg-muted text-caption">Last updated {{ dateTime(profile.updatedAt) }}</div>
      </div>
      <div class="col-12 col-sm-auto row q-gutter-sm">
        <q-btn
          outline
          no-caps
          color="primary"
          icon="edit"
          label="Edit"
          class="eg-btn"
          @click="emit('edit')"
        />
        <q-btn
          outline
          no-caps
          color="negative"
          icon="delete"
          label="Delete"
          class="eg-btn"
          @click="emit('delete')"
        />
      </div>
    </q-card-section>

    <q-card-section class="row q-col-gutter-md q-pt-none">
      <div class="col-12 col-md-4">
        <div class="info-tile">
          <q-icon name="call" color="secondary" size="22px" />
          <div>
            <div class="text-caption eg-muted">Phone</div>
            <div class="text-weight-medium">{{ profile.phone }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="info-tile">
          <q-icon name="place" color="secondary" size="22px" />
          <div>
            <div class="text-caption eg-muted">Address</div>
            <div class="text-weight-medium">{{ profile.address }}</div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="text-caption eg-muted q-mb-xs">Branches ({{ profile.branches.length }})</div>
        <q-chip v-for="b in profile.branches" :key="b" icon="location_on" class="eg-chip-soft">{{
          b
        }}</q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { dateTime } from 'src/utils/format.js'

defineProps({ profile: { type: Object, required: true } })
const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped lang="scss">
.profile-banner {
  height: 96px;
  background:
    radial-gradient(circle at 90% 0%, rgba(244, 185, 66, 0.55), transparent 45%),
    linear-gradient(120deg, #154d38, #1e6f50 55%, #e8702a 140%);
}
.profile-body {
  margin-top: -56px;
}
.profile-logo {
  background: var(--eg-surface);
  border: 4px solid var(--eg-surface);
  box-shadow: var(--eg-shadow);
}
.info-tile {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--eg-border);
  height: 100%;
}
</style>
