<template>
    <el-dialog width="500px" title="终端状态" :visible="visible" @close="$emit('close')"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <avue-detail :option="option" v-model="data"/>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        visible: Boolean,
        data: Object,
    },
    computed: {
        option() {
            return {
                column: [{
                    label: '终端编号',
                    prop: 'sn',
                    row: true,
                    span: 24,
                }, {
                    label: '模组编号',
                    prop: 'imei',
                    row: true,
                    span: 24,
                }, {
                    label: '传输通道',
                    prop: 'channel',
                    row: true,
                    span: 24,
                }, {
                    label: '最早上报时间',
                    prop: 'firstReportTime',
                    row: true,
                    span: 24,
                }, {
                    label: '最后上报时间',
                    prop: 'lastReportTime',
                    row: true,
                    span: 24,
                }, {
                    label: '上报帧计数',
                    prop: 'reportCount',
                    row: true,
                    span: 24,
                }, {
                    label: '最早下发时间',
                    prop: 'firstIssuedTime',
                    row: true,
                    span: 24,
                }, {
                    label: '最后下发时间',
                    prop: 'lastIssuedTime',
                    row: true,
                    span: 24,
                }, {
                    label: '下发帧计数',
                    prop: 'issuedCount',
                    row: true,
                    span: 24,
                }]
            };
        },
    },
}
</script>

<style scoped>
.wrapper {
    line-height: 0px;
}

.el-dialog__wrapper >>> .el-dialog__body {
    padding: 10px;
}
</style>
