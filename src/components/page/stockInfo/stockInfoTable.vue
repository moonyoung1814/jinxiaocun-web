<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 进货项表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="color: #8c939d">
                进货单编号：{{this.$route.query.stockId}}
            </div>
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="turnToForm"
                    v-if="this.flag">
                    新增
                </el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                    v-if="this.flag"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-success"
                    @click="onSubmit"
                    class="handle-del mr10"
                    v-if="this.flag"
                >提交</el-button>
                <el-button
                    type="primary"
                    @click="turnBack">
                    返回
                </el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name = "table-header"
                @selection-change = "handleSelectionChange"
            >
                <el-table-column fixed label="序号" width="55"   align="center">
                    <template scope="scope">
                        <span>{{ scope.$index+1}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="goodName" label="货物名"></el-table-column>
                <el-table-column prop="goodNum" label="进货数量"></el-table-column>
                <el-table-column prop="goodPrice" label="进货总价"></el-table-column>
                <el-table-column prop="good.price" label="售价"></el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="this.flag">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row.id)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total = "pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchData } from "@/api";
import { deleteData } from "@/api";

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            flag:false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    mounted() {
        if(this.$route.query.flag==='false'){
            this.flag = false;
        }else{
            this.flag = true;
        }
        this.getData(this.$route.query.stockId);
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData(stockId) {
            let url = 'stock_info?stockId=' + stockId
            fetchData(url).then(res => {
                this.tableData = res.data
            });
        },
        onSubmit(){
            this.$confirm("提交后无法修改，是否提交？", '提示', {
                type: "warning"
            }).then(()=>{
                this.$router.push('../stock/index')
            })
        },
        turnBack(){

            if(this.flag){
                this.$confirm('返回即销毁该进货单，是否返回？','提示',{
                    type: 'warning'
                }).then(()=>{
                    let url = 'stock/'+this.$route.query.stockId
                    deleteData(url).then(res=>{
                        this.$router.push('../stock/index')
                    })
                })
            }else{
                this.$router.push('../stock/index')
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, id) {

            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    console.log(id);
                    let url = "stock_info/" + id;
                    deleteData(url).then(res =>{
                        this.$message.success("删除成功");
                        this.tableData = undefined;
                        this.getData(this.$route.query.stockId);
                    })
                })
                .catch(() => {});
        },
        turnToForm(){
            let url = '../stockInfo/form?stockId='+this.$route.query.stockId;
            this.$router.push(url)
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        cancelEdit(){

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
