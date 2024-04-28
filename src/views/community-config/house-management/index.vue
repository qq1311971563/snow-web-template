<script>
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'
import LinkOwner from '@/views/community-config/house-management/link-owner.vue'
import UnlinkOwner from '@/views/community-config/house-management/unlink-owner.vue'

export default {
  name: 'Index',
  components: { UnlinkOwner, LinkOwner, SnowCrud },
  computed: {
    LinkOwner() {
      return LinkOwner
    }
  },
  methods: {
    refresh() {
      this.$refs.crud.refresh()
    }
  }
}
</script>

<template>
  <snow-crud
    ref="crud"
    :options="[
      {label:'所属区域',prop:'areaId', type: 'dict',api:'/community-area/search', isSearch: 'true', linkProp:'buildingId'},
      {label:'所属楼栋',prop:'buildingId', type: 'dict',api:'/community-building/search', isSearch: 'true'},
      {label:'房屋编号',prop:'code'},
      {label:'完整编号',prop:'fullCode', showCreate: false, showUpdate: false},
      {label:'所处楼层',prop:'floor',type:'number', default: 1},
      {label:'建筑面积',prop:'allArea', type: 'float', default: 100},
      {label:'套内面积',prop:'insideArea', type: 'float', default: 100},
      {label:'绑定状态',prop:'status', type: 'dict', isSearch: true, options:[{name:'待绑定',id:0},{name:'已绑定',id:1}], default: 0, showUpdate: false, showCreate: false}
    ]"
    query-api="/community-house/page"
    create-api="/community-house/create"
    update-api="/community-house/update"
    delete-api="/community-house/delete"
    del-prompt-key="code"
  >
    <template v-slot:rowAction="{row}">
      <link-owner :house="row" @success="refresh" />
      <unlink-owner :house="row" @success="refresh" />
    </template>
  </snow-crud>
</template>

<style scoped lang="scss">

</style>
