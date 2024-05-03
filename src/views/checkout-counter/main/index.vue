<script>
import HouseSelect from '@/views/components/HouseSelect.vue'
import SnowTable from '@/snow-framework/components/SnowTable.vue'
import DoPay from '@/views/checkout-counter/main/do-pay.vue'
import AddTempBill from '@/views/checkout-counter/main/add-temp-bill.vue'
import OrderPrint from '@/views/checkout-counter/main/order-print.vue'
import AddFeeItem from '@/views/checkout-counter/main/add-fee-item.vue'
import RemoveFeeItem from '@/views/checkout-counter/main/remove-fee-item.vue'
import OrderDetails from '@/views/checkout-counter/main/order-details.vue'
import DepositRecharge from '@/views/checkout-counter/main/deposit-recharge.vue'
import { post } from '@/snow-framework/Request'
import DepositRefund from '@/views/checkout-counter/main/deposit-refund.vue'
import SnowUpdate from '@/snow-framework/components/SnowUpdate.vue'
import SnowCrud from '@/snow-framework/components/SnowCrud.vue'

export default {
  name: 'Index',
  components: {
    SnowCrud,
    SnowUpdate,
    DepositRefund,
    DepositRecharge,
    OrderDetails,
    RemoveFeeItem,
    AddFeeItem,
    OrderPrint,
    AddTempBill,
    DoPay,
    SnowTable,
    HouseSelect
  },
  data() {
    return {
      currentHouse: null,
      waitPayParams: {
        payStatus: 0,
        houseId: null
      },
      historyPayParams: {
        ownerId: null,
        houseId: null
      },
      houseFeeParam: {
        houseId: null
      },
      depositTableParams: {
        houseId: null
      },
      selectedWaitPayOrders: []
    }
  },
  methods: {
    refresh() {
      this.$refs.waitPayTable.refresh()
      this.$refs.historyPayTable.refresh()
      this.$refs.houseFeeTable.refresh()
      this.$refs.depositTable.refresh()
    },
    currentHouseChange(house) {
      post('/community-house/get-details', { id: house.id }).then(res => {
        if (!res.success) {
          this.$message.error(res.message)
          return
        }
        this.currentHouse = res.data
        this.waitPayParams.houseId = res.data.id
        this.historyPayParams.houseId = res.data.id
        this.houseFeeParam.houseId = res.data.id
        this.depositTableParams.houseId = res.id
      })
      this.waitPayParams.houseId = house.id
      this.historyPayParams.houseId = house.id
      this.houseFeeParam.houseId = house.id
      this.depositTableParams.houseId = house.id
      this.refresh()
    },
    toRefresh() {
      this.currentHouseChange(this.currentHouse)
      this.refresh()
    }
  }
}
</script>

<template>
  <div class="view-container">
    <house-select @change="currentHouseChange" @search="refresh" />
    <div style="border: 1px solid #e5e5e5;padding: 5px;flex: 1">
      <el-form>
        <el-row :gutter="4">
          <el-col :span="4">
            <el-form-item label="房屋编号">{{ currentHouse && currentHouse.fullCode || '\\' }}</el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="建筑面积">{{ currentHouse && currentHouse.allArea || '\\' }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="入住日期">
              {{ currentHouse && currentHouse.ownerHouse.checkInDate.substring(0, 10) || '\\' }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="业主姓名">{{
              currentHouse && currentHouse.owner && currentHouse.owner.name || '\\'
            }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="业主电话">{{
              currentHouse && currentHouse.owner && currentHouse.owner.phone || '\\'
            }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="押金余额">
              <span style="color: green">{{
                currentHouse && currentHouse.depositBalance || '0.00'
              }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码">{{
              currentHouse && currentHouse.owner && currentHouse.owner.idCard || '\\'
            }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs>
        <el-tab-pane label="待支付费用">
          <do-pay
            :deposit-balance="currentHouse && currentHouse.depositBalance || '0.00'"
            :pay-orders="selectedWaitPayOrders"
            :house-id="currentHouse && currentHouse.id || null"
            @success="refresh"
          />
          <add-temp-bill :house-id="currentHouse && currentHouse.id" />
          <snow-update
            v-show="false"
            ref="updateBill"
            update-api=""
            :options="[
              {label: '账单名称', prop:'name', disabled: true},
              {label: '费用类型',prop:'type', disabled: true, type: 'dict', options: [{name:'周期性收费',id:1},{name:'临时收费',id: 2}]},
              {label: '开始日期', disabled: true, prop:'beginDate'},
              {label: '结束日期', disabled: true, prop:'endDate'},
              {label: '账单金额', disabled: true, prop:'total'},
              {label: '账单状态', disabled: true, prop:'payStatus', type: 'dict', options: [{name:'未支付',id: 0},{name:'已支付',id: 1},{name:'已取消',id: 2}]},
            ]"
          />
          <snow-crud
            ref="waitPayTable"
            :query-params="waitPayParams"
            query-api="/community-payment-bill/page"
            update-api="/community-payment-bill/update"
            update-button-text="修改金额"
            :selected.sync="selectedWaitPayOrders"
            :init-data="false"
            :options="[
              {label: '账单名称', prop:'name',disUpdate: true},
              {label: '费用类型',prop:'type',disUpdate: true, type: 'dict', options: [{name:'周期性收费',id:1},{name:'临时收费',id: 2}]},
              {label: '开始日期', prop:'beginDate',disUpdate: true},
              {label: '结束日期', prop:'endDate',disUpdate: true},
              {label: '账单金额', prop:'total', type: 'float'},
              {label: '账单状态', prop:'payStatus',disUpdate: true, type: 'dict', options: [{name:'未支付',id: 0},{name:'已支付',id: 1},{name:'已取消',id: 2}]},
              {label: '创建时间', prop:'createTime',disUpdate: true, type: 'date'}
            ]"
          />
          <!--          <snow-table-->
          <!--            ref="waitPayTable"-->
          <!--            :query-params="waitPayParams"-->
          <!--            query-api="/community-payment-bill/page"-->
          <!--            :selected.sync="selectedWaitPayOrders"-->
          <!--            :init-data="false"-->
          <!--            :enable-action="true"-->
          <!--            :options="[-->
          <!--              {label: '账单名称', prop:'name'},-->
          <!--              {label: '费用类型',prop:'type', type: 'dict', options: [{name:'周期性收费',id:1},{name:'临时收费',id: 2}]},-->
          <!--              {label: '开始日期', prop:'beginDate'},-->
          <!--              {label: '结束日期', prop:'endDate'},-->
          <!--              {label: '账单金额', prop:'total'},-->
          <!--              {label: '账单状态', prop:'payStatus', type: 'dict', options: [{name:'未支付',id: 0},{name:'已支付',id: 1},{name:'已取消',id: 2}]},-->
          <!--              {label: '创建时间', prop:'createTime', type: 'date'}-->
          <!--            ]"-->
          <!--          />-->
        </el-tab-pane>
        <el-tab-pane label="历史缴费">
          <snow-table
            ref="historyPayTable"
            :enable-action="true"
            :query-params="historyPayParams"
            query-api="/community-payment-order/page"
            :init-data="false"
            :options="[
              {label: '订单号', prop:'orderCode'},
              {label: '发起时间', prop:'createTime'},
              {label: '支付时间', prop:'payTime'},
              {label: '订单总额', prop:'total'},
              {label: '押金抵扣', prop:'depositPay'},
              {label: '实际收款', prop:'realMoney'},
              {label: '收费员', prop:'payName'},
              {label: '支付方式', prop:'payType', type: 'dict', options: [{name:'现金',id:0},{name: '微信', id: 1},{name:'支付宝',id: 2}]},
              {label: '支付状态',prop:'payStatus', type: 'dict', options: [{name:'待支付',id:0},{name:'支付中',id: 1},{name:'支付完成',id: 2}]},
              {label: '退款状态', prop:'refundStatus', type: 'dict', options: [{name:'未退款',id:0},{name:'部分退款',id: 1},{name:'全部退款',id: 2}]},
            ]"
          >
            <template v-slot:rowAction="{row}">
              <order-print v-if="row.payStatus === 2 && row.refundStatus === 0" :order-id="row.id" />
              <order-details :pay-order-id="row.id" />
            </template>
          </snow-table>
        </el-tab-pane>
        <el-tab-pane label="押金管理">
          <deposit-recharge :house-id="currentHouse && currentHouse.id" @success="toRefresh" />
          <deposit-refund
            :house-id="currentHouse && currentHouse.id"
            :max-refund-money="currentHouse && currentHouse.depositBalance"
          />
          <snow-table
            ref="depositTable"
            query-api="/community-deposit-record/page"
            :query-params="depositTableParams"
            :init-data="false"
            :options="[
              {label:'类型', prop: 'type',type: 'dict',slot:'money', options: [{name:'押金缴纳',id: 1},{name:'押金退款',id: 2},{name:'支付抵扣',id: 3}]},
              {label:'变动金额', prop: 'money',type:'slot'},
              {label:'变动后余额', prop: 'balance'},
              {label:'创建时间', prop: 'createTime'},
              {label:'支付/扣款时间', prop: 'payTime'},
              {label:'支付/扣款人', prop: 'payName'},
            ]"
          >
            <template v-slot:money="{row}">
              <el-tag :closable="false" :type="row.type === 1 ? 'success' : 'danger'">
                {{ row.type === 1 ? row.money : '-' + row.money }}
              </el-tag>
            </template>
          </snow-table>
        </el-tab-pane>
        <el-tab-pane label="周期费用信息">
          <add-fee-item :house-id="currentHouse && currentHouse.id" @success="refresh" />
          <snow-table
            ref="houseFeeTable"
            query-api="/community-house/house-fee-list"
            :query-params="houseFeeParam"
            :init-data="false"
            :page="false"
          >
            <el-table-column label="费用名称">
              <template v-slot="{row}">
                <span>{{ row.feeItem.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="收费周期">
              <template v-slot="{row}">
                <span>{{ ['', '按月收费', '按季度收费', '按年收费'][row.feeItem.feeCycle] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="添加日期">
              <template v-slot="{row}">
                <span>{{ row.createTime.substring(0, 10) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="beginDate" label="开始缴费日期">
              <template v-slot="{row}">
                <span>{{ row.beginDate.substring(0, 10) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nextDate" label="下次缴费日期">
              <template v-slot="{row}">
                <span>{{ row.nextDate.substring(0, 10) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="expiredDate" label="截止日期">
              <template v-slot="{row}">
                <span>{{ row.expiredDate.substring(0, 10) }}</span>
              </template>
            </el-table-column>
            <el-table-column>
              <template v-slot="{row}">
                <remove-fee-item :id="row.id" :name="row.feeItem.name" @success="refresh" />
              </template>
            </el-table-column>
          </snow-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "~@/snow-framework/main.css";
</style>
