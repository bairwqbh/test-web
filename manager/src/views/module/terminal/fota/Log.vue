<template>
    <el-dialog width="1000px" top="10vh" title="升级日志"
        :visible="visible" @close="$emit('close')" @open="open"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <el-select v-model="param.terminalId"
            @change="loadData" placeholder="请选择终端" clearable>
            <el-option v-for="item in terminalList"
                :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <scroll-load class="scroll-list" :data="list" @scroll="scroll">
            <template v-slot:item="{item}">{{ showItem(item) }}</template>
        </scroll-load>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import FotaLogApi from '@/api/terminal/FotaLogApi';
import TerminalFotaApi from '@/api/terminal/TerminalFotaApi';
import ScrollLoad from '@/components/ScrollLoad';

export default {
    data() {
        return {
            list: [],
            terminalList: [],
            page: {
                page: 1,
                size: 100,
                total: 0,
            },
            param: {},
        };
    },
    props: {
        visible: Boolean,
        data: Object,
    },
    computed: {
        ...mapGetters(['dictMap']),
    },
    methods: {
        open() {
            this.list = [];
            this.terminalList = [];
            this.param = {};
            if (!this.data || !this.data.upgradeId) {
                return;
            }
            this.param.upgradeId = this.data.upgradeId;
            TerminalFotaApi.list(this.param)
                .then(result => this.terminalList = result
                .map(({terminalId}) => ({label: terminalId, value: terminalId})));
            this.loadData();
        },
        loadData() {
            this.list = [];
            if (!this.data) {
                return;
            }
            this.page.page = 1;
            FotaLogApi.page(Object.assign({}, this.page, this.param)).then(result => {
                if (result) {
                    this.page.total = result.total;
                    if (result.list && result.list.length) {
                        this.list.push(...result.list);
                    }
                }
            });
        },
        scroll(callback) {
            this.page.page += 1;
            FotaLogApi.page(Object.assign({}, this.page, this.param)).then(result => {
                if (result) {
                    this.page.page = result.page;
                    this.page.total = result.total;
                    if (result.list && result.list.length) {
                        callback(result.list)
                    }
                }
            });
        },
        showItem(item) {
            let array = [];
            if (item) {
                array.push(item.timestamp);
                array.push(item.terminalId);
                let transportType = item.transportType;
                if (this.dictMap['transport_type'] && this.dictMap['transport_type'][transportType]) {
                    transportType = this.dictMap['transport_type'][transportType];
                }
                array.push(transportType);
                array.push(item.info);
            }
            return array.join(' - ');
        },
        exp() {
            if (!this.data) {
                return;
            }
            FotaLogApi.exp(this.param);
        },
    },
    components: { ScrollLoad }
}
</script>

<style scoped>
.el-dialog__wrapper >>> .el-dialog__body {
    padding: 10px;
}

.scroll-list {
    max-height: 600px;
    margin-top: 10px;
}
</style>
