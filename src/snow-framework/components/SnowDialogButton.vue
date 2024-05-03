<script>
export default {
  name: 'SnowDialogButton',
  props: {
    buttonText: {
      type: String,
      default: '未定义'
    },
    title: {
      type: String,
      default: '未定义title'
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    buttonIcon: {
      type: String,
      default: ''
    },
    buttonSize: {
      type: String,
      default: 'small'
    },
    plain: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    showBefore: {
      type: Function,
      default: () => true
    },
    doConfirm: {
      type: Function,
      default: () => true
    },
    disConfirm: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    needConfirmHide: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      component: {
        confirmText: ''
      },
      confirming: false,
      visible: false,
      showDialog: true
    }
  },
  created() {
    this.component.confirmText = this.confirmText
  },
  methods: {
    async toConfirm() {
      this.confirming = true
      this.component.confirmText = '执行中...'
      if (this.needConfirmHide) {
        this.showDialog = false
      }
      const result = await this.doConfirm.call(this.$parent)
      if (this.needConfirmHide) {
        this.showDialog = true
      }
      this.component.confirmText = this.confirmText
      this.confirming = false
      if (result) {
        this.visible = false
      }
    },
    async toShow() {
      const result = await this.showBefore.call(this.$parent)
      if (result === undefined || result) {
        this.visible = true
      }
    }
  }
}
</script>

<template>
  <div style="display: inline-block;margin-left: 10px">
    <el-button :type="buttonType" :plain="plain" :disabled="disabled" :icon="buttonIcon" :size="buttonSize" @click="toShow">{{ buttonText }}</el-button>
    <el-dialog v-if="visible" v-show="showDialog" :visible.sync="visible" :title="title" :append-to-body="appendToBody" :close-on-click-modal="false">
      <slot />
      <span v-if="showCancel || toConfirm" slot="footer" class="dialog-footer">
        <el-button v-if="showCancel" @click="visible = false">取 消</el-button>
        <el-button v-if="toConfirm" :disabled="disConfirm" type="primary" :loading="confirming" @click="toConfirm">{{
          component.confirmText
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
