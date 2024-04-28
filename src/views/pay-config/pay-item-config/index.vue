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
      {label:'收费项目',prop:'name', isSearch: true},
      {label:'收费类型',prop:'type', type: 'dict',default: 1, options: [{name:'周期性收费',id:1},{name:'临时收费',id: 2}], isSearch: true},
      {label:'收费周期',prop:'feeCycle',type: 'dict',default: 1,options:[{name:'按月收费',id:1},{name:'按季收费',id:2},{name:'按月收费',id:3},{name:'按年收费',id:4}]},
      {label:'收费数量',prop:'feeNum', type: 'number', default: 1},
      {label:'收费单价/元',prop:'feePrice', default: 1, type: 'float'},
      {label:'收费规则',prop:'feeRule', default: 1, type: 'dict',options: [{name:'单价*数量*建筑面积',id:1},{name:'单价*建筑面积',id:2}]},
      {label:'自动绑定',prop:'autoBind', default: 1, type: 'dict',options: [{name:'自动绑定',id:1},{name:'不自动绑定',id:-1}]},
    ]"
    query-api="/community-fee-item/page"
    create-api="/community-fee-item/create"
    update-api="/community-fee-item/update"
    delete-api="/community-fee-item/delete"
    :del-prompt-key="'name'"
  />
</template>

<style scoped lang="scss">

</style>
