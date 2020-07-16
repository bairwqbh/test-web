<template>
    <el-dialog width="640px" title="绑定终端" :visible="isShow"
        :close-on-click-modal="no" :close-on-press-escape="no" @open="open" @close="close">
        <el-transfer v-model="value" :data="list" :titles="titles" :props="props" @change="change" filterable/>
        <template v-slot:footer>
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button @click="close">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import TerminalApi from '@/api/terminal/TerminalApi';
import TerminalCommoduApi from '@/api/terminal/TerminalCommoduApi';

export default {
    data() {
        return {
            closeOnModal: false,
            list: [],
            value: [],
            titles: ["未绑定", "已绑定"],
            props: {key: "terminalId", label: "terminalId"},
        }
    },
    props: {
        isShow: Boolean,
        data: Object,
    },
    methods:{
        open() {
            if (!this.data || !this.data.imei) {
                return;
            }
            TerminalApi.bindInfo({imei: this.data.imei}).then(result => {
                if (result) {
                    this.list = result.list && result.list.length ? result.list : [];
                    this.value = result.value && result.value.length ? result.value : [];
                }
            });
        },
        sure() {
            if (!this.data || !this.data.imei) {
                this.$message.warning('没有模组信息无法提交！');
                return;
            }
            let terminalId = this.value && this.value.length ? this.value[0] : null;
            TerminalCommoduApi.bindTerminal({
                imei: this.data.imei,
                terminalId
            }).then(result => {
                if (result) {
                    this.$message.success('操作成功！');
                    this.close();
                }
            });
        },
        close() {
            this.$emit("close", null);
        },
        change(value, action, arr) {
            if (value.length > 1 && action == 'right') {
                value.splice(value.length - arr.length, arr.length);
            }
        },
    },
}
</script>

<style scoped>
.el-dialog__wrapper >>> .el-transfer-panel {
    width: 250px;
}

.el-dialog__wrapper >>> .el-transfer-panel__body {
    height: 450px;
}

.el-dialog__wrapper >>> .el-transfer-panel__list.is-filterable {
    height: 400px;
}
</style>
