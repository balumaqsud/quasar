<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <div class="full-width row items-center justify-between app-navbar-container">
          <q-toolbar-title class="row items-center no-wrap">
            <q-icon name="inventory_2" class="q-mr-sm" />
            <div>
              <div class="text-subtitle1">Vue + Quasar CRUD Task</div>
            </div>
          </q-toolbar-title>

          <div class="row items-center q-gutter-sm">
            <q-btn
              flat
              dense
              no-caps
              color="white"
              label="Inventory"
              icon="table_view"
              :to="{ name: 'products-list' }"
            />
            <q-btn
              flat
              dense
              no-caps
              color="white"
              label="Add Product"
              icon="add_circle"
              :to="{ name: 'products-create' }"
            />
            <q-btn
              flat
              dense
              no-caps
              color="white"
              label="Reports"
              icon="insights"
              disable
            />
            <q-btn
              flat
              dense
              no-caps
              color="white"
              label="Settings"
              icon="settings"
              disable
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-grey-4">
      <q-toolbar>
        <q-toolbar-title class="text-center text-body2">
          by oliver for Furor Progress
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
// layout is purely presentational
</script>
