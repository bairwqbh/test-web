<template>
    <el-dialog width="640px" title="绑定终端" :visible="isShow"
        :close-on-click-modal="no" :close-on-press-escape="no" @open="open" @close="close">
        <el-transfer v-model="value" :data="list" :titles="titles" :props="props" filterable/>
        <template v-slot:footer>
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button @click="close">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
import TerminalApi from '@/api/terminal/TerminalApi';
import TerminalFotaApi from '@/api/terminal/TerminalFotaApi';

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
            if (!this.data || !this.data.upgradeId) {
                return;
            }
            TerminalApi.fotaBindInfo({
                typeId: this.data.typeId,
                upgradeId: this.data.upgradeId
            }).then(result => {
                if (result) {
                    this.list = result.list && result.list.length ? result.list : [];
                    this.value = result.value && result.value.length ? result.value : [];
                }
            });
        },
        sure() {
            if (!this.data || !this.data.upgradeId) {
                this.$message.warning('没有升级信息无法提交！');
                return;
            }
            TerminalFotaApi.bind({
                upgradeId: this.data.upgradeId,
                terminalIdList: this.value
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
