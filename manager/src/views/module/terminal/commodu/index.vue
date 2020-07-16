<template>
    <el-container>
        <avue-crud :option="option" :data="data" :page="page"
            :permission="permission" @on-load="loadData"
            @refresh-change="loadData" @search-change="loadData"
            @row-save="add" @row-del="del" @row-update="mod">
            <template v-slot:search>
                <el-col :md="4">
                    <el-input placeholder="请输入关键字" v-model="param.keyword" clearable/>
                </el-col>
                <el-col :md="4">
                    <el-select v-model="param.typeId" @change="loadData" placeholder="请选择模组类型" clearable>
                        <el-option v-for="item in dictList.channel"
                            :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-col>
            </template>
            <template v-slot:menuLeft>
                <el-button type="primary" size="small" @click="expTpl" icon="el-icon-download">导出模板</el-button>
                <el-upload class="upload" name="file" accept=".xls,.xlsx" :action="action"
                    :headers="headers" :multiple="no" :show-file-list="no" :with-credentials="yes"
                    :on-success="success" :before-upload="beforeUpload" :on-error="error">
                    <el-button type="primary" size="small" icon="el-icon-upload2"
                        v-if="$store.getters.isAuth('ter:commodu:imp')">导入数据</el-button>
                </el-upload>
                <el-button type="primary" size="small" @click="expData" icon="el-icon-download"
                    v-if="$store.getters.isAuth('ter:commodu:exp')">导出数据</el-button>
            </template>
            <template v-slot:menu="{type, size, row}">
                <el-button :type="type" :size="size" @click="bind(row)" icon="el-icon-connection"
                    v-if="$store.getters.isAuth('ter:commodu:bind')">绑定终端</el-button>
            </template>
        </avue-crud>
        <bind :isShow="bindIsShow" :data="row" @close="close"/>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { Common } from "cby.assist";
import CommoduApi from '@/api/terminal/CommoduApi';
import Bind from './Bind';

export default {
    data() {
        return {
            typeList: [],
            data: [],
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            param: {
                keyword: null,
                typeId: null,
            },
            row: null,
            bindIsShow: false,
            loading: null,
        };
    },
    computed: {
        ...mapGetters(['dictList']),
        option() {
            return {
                border: true,
                viewBtn: true,
                dialogDrag: true,
                dialogEscape: false,
                dialogClickModal: false,
                labelWidth: 120,
                menuWidth: 260,
                column: [{
                    label: '模组编号',
                    prop: 'imei',
                    rules: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '模组类型',
                    prop: 'commoduType',
                    type: 'select',
                    dicData: this.dictList['channel']
                }, {
                    label: '通信卡编号',
                    prop: 'imsi',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '物联网卡号',
                    prop: 'iotNo',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }, {
                    label: '唯一通信号',
                    prop: 'msisdn',
                    rules: [{
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }]
                }]
            };
        },
        permission() {
            return this.$store.getters.getAuthData('ter:commodu');
        },
        action() {
            return `${this.$config.baseUrl}${this.$config.basePath}/commodu/impData`;
        },
        headers() {
            return {token: Common.getCookie("token")};
        },
    },
    methods: {
        loadData(page) {
            CommoduApi.page(Object.assign({
                page: page.currentPage,
                size: page.pageSize
            }, this.param)).then(result => {
                if (result.list) {
                    this.data = result.list;
                } else {
                    this.data = [];
                }
                this.page.total = result.total;
            });
        },
        add(row, done, loading) {
            CommoduApi.add(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('新增成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        mod(row, index, done, loading) {
            CommoduApi.mod(row).then(result => {
                if (result) {
                    done();
                    this.$message.success('修改成功！');
                    this.loadData(this.page);
                }
            }).catch(() => loading());
        },
        del(row, index) {
            this.$confirm('确认删除该记录吗?', {
                type: 'warning'
            }).then(() => {
                CommoduApi.del(row.id).then(result => {
                    if (result) {
                        this.$message.success('删除成功！');
                        this.loadData(this.page);
                    }
                });
            }).catch(() => {});
        },
        bind(row) {
            this.row = row;
            this.bindIsShow = true;
        },
        close() {
            this.bindIsShow = false;
        },
        expTpl() {
            CommoduApi.expTpl();
        },
        expData() {
            CommoduApi.expData(this.param);
        },
        beforeUpload() {
            this.loading = this.$loading();
        },
        success(response, file, fileList) {
            this.loading && this.loading.close();
            if (response.code == 0) {
                this.loadData(this.page)
                this.$message.success('提交成功！');
            } else {
                this.$message.error(response.message);
            }
        },
        error(err, file) {
            this.loading && this.loading.close();
            this.$message.error('提交失败！');
        },
    },
    components: { Bind },
}
</script>

<style scoped>
.upload {
    display: inline;
}
</style>
