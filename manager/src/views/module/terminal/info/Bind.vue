<template>
    <el-dialog width="640px" title="绑定模组" :visible="visible" @open="open" @close="close"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <el-transfer v-model="value" :data="list" :titles="titles" :props="props" filterable/>
        <template v-slot:footer>
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button @click="close">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import CommoduApi from '@/api/terminal/CommoduApi';
import TerminalCommoduApi from '@/api/terminal/TerminalCommoduApi';

export default {
    data() {
        return {
            closeOnModal: false,
            list: [],
            value: [],
            titles: ["未绑定", "已绑定"],
            props: {key: "imei", label: "imei"},
        }
    },
    props: {
        visible: Boolean,
        data: Object,
    },
    methods:{
        open() {
            if (!this.data || !this.data.terminalId) {
                return;
            }
            CommoduApi.bindInfo({terminalId: this.data.terminalId}).then(result => {
                if (result) {
                    this.list = result.list && result.list.length ? result.list : [];
                    this.value = result.value && result.value.length ? result.value : [];
                }
            });
        },
        sure() {
            if (!this.data || !this.data.terminalId) {
                this.$message.warning('没有终端信息无法提交！');
                return;
            }
            TerminalCommoduApi.bindCommodu({
                terminalId: this.data.terminalId,
                imeiList: this.value
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
