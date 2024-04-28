<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PermissionsSelect',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkKeys: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes'
    ]),
    filteredPermissionRoutes() {
      return this.permission_routes.filter(item => item.name)
    }
  },
  created() {
    this.checkKeys = this.value ? JSON.parse(this.value) : []
  },
  methods: {
    doChange(val, val2, val3) {
      this.$emit('input', JSON.stringify(val2.checkedKeys || []))
    }
  }
}
</script>

<template>
  <el-tree
    ref="tree"
    :data="filteredPermissionRoutes"
    :props="{
      children: 'children',
      label: 'name',
    }"
    show-checkbox
    node-key="path"
    :highlight-current="true"
    :default-checked-keys="checkKeys"
    @check="doChange"
  />
</template>

<style scoped lang="scss">

</style>
