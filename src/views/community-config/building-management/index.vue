<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'

export default {
  name: 'Index',
  components: { SnowCrud }
}
</script>

<template>
  <snow-crud
    :options="[
      {label:'楼栋编码',prop:'code', isSearch: true},
      {label:'楼栋名称',prop:'name', isSearch: true},
      {label:'所属区域',prop:'areaId', isSearch: true, type: 'dict',api:'/community-area/search' },
      {label:'地上楼层数',prop:'floorNumber', type: 'number',default: 1},
      {label:'地下楼层数',prop:'lowFloorNumber',type: 'number',default: 0},
      {label:'每层房屋数',prop:'floorHouseNumber',type: 'number',default: 5},
      {label:'建筑面积',prop:'defaultAllArea',type: 'float', default: 100.00},
      {label:'套内面积',prop:'defaultInsideArea',type: 'float', default: 100.00}
    ]"
    query-api="/community-building/page"
    create-api="/community-building/create"
    update-api="/community-building/update"
    delete-api="/community-building/delete"
    del-prompt-key="name"
  />
</template>

<style scoped lang="scss">

</style>
