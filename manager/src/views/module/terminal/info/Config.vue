<template>
    <el-dialog width="500px" title="终端配置" :visible="visible"
        @open="open" @close="$emit('close')"
        :close-on-click-modal="no" :close-on-press-escape="no">
        <avue-form ref="form" v-model="form" :option="option" @submit="submit"/>
    </el-dialog>
</template>

<script>
import TerminalApi from '@/api/terminal/TerminalApi';

export default {
    data() {
        return {
            form: {},
        }
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
                    prop: 'terminalId',
                    readonly: true,
                    span: 24,
                }, {
                    label: '清除报文',
                    prop: 'clearRaw',
                    type: 'radio',
                    button: true,
                    valueDefault: false,
                    dicData: [{
                        label: '开启',
                        value: true
                    }, {
                        label: '关闭',
                        value: false
                    }],
                    span: 24,
                }]
            };
        },
    },
    methods:{
        open() {
            this.$refs.form && this.$refs.form.resetForm();
            if (!this.data) {
                return;
            }
            Object.assign(this.form, this.data.config);
        },
        submit(form, done) {
            if (!form.terminalId) {
                form.terminalId = this.data.terminalId;
            }
            TerminalApi.config(form).then(result => {
                done();
                if (result) {
                    this.$message.success('操作完成！');
                    this.$emit('close', form);
                }
            }).catch(error => done());
        },
    },
}
</script>

<style scoped>

</style>
