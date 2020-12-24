<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="货物名称（支持模糊搜索）" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="newGood">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="序号" width="55" align="center">
                    <template scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="货物名"></el-table-column>
                <el-table-column prop="num" label="库存量"></el-table-column>
                <el-table-column prop="introduction" label="货物介绍"></el-table-column>
                <el-table-column prop="price" label="零售单价"></el-table-column>
                <el-table-column label="图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.picUrl"
                            :preview-src-list="[scope.row.picUrl]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row.id)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <el-dialog title="身份验证" :visible.sync="editVisible" width="30%">
<!--            <el-form ref="form" :model="form" label-width="70px">-->
<!--                <el-form-item label="用户名">-->
<!--                    <el-input v-model="form.name"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="地址">-->
<!--                    <el-input v-model="form.address"></el-input>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
            <el-input type="password" placeholder="请输入密码" v-model="query.password"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
import { deleteData } from "../../../api/index";

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                password: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            goods: [],
            user: {password:'123'},
            tableData: [],
            editVisible: false,
            multipleSelection: [],
            delForm: [],
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData()
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData('good').then(res => {
                this.goods = res.data;
                for(let i=0;i<this.query.pageSize&&i<res.data.length;i++){
                    this.tableData.push(this.goods[i]);
                }
                this.pageTotal = res.data.length;
            });
        },
        newGood(){
            let url = '../'
            this.$router.push(url)
        },
        // 触发搜索按钮
        handleSearch() {
            //可能存在Bug
            this.tableData = undefined
            this.tableData = []
            for(let i=0;i<this.goods.length;i++){
                if (!this.goods[i].name.indexOf(this.query.name)){
                    this.tableData.push(this.goods[i])
                }
            }
            this.pageTotal = this.tableData.length
        },

        // 删除操作
        handleDelete(index, row) {
            this.editVisible = true
            this.delForm = row
            console.log(this.delForm)
            // 二次确认删除
            // this.$confirm('确定要删除吗？', '提示', {
            //     type: 'warning'
            // }).then(() => {
            //     // this.$message.success('删除成功');
            //     // this.tableData.splice(index, 1);
            //
            //
            // }).catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作
        handleEdit(index, goodId) {
            let url = 'form?id='+ goodId
            this.$router.push(url)
            // this.idx = index;
            // this.form = row;
            // this.editVisible = true;
        },
        // 确认删除
        saveDelete() {
            if(this.query.password===this.user.password){
                this.$confirm('删除后无法恢复，是否确认删除？', '提示', {
                    type: 'warning'
                }).then(()=>{
                    let url = 'good/'+this.delForm.id
                    deleteData(url).then(res =>{
                        this.tableData = undefined
                        this.tableData = []
                        this.$message.success('删除成功')
                        this.editVisible = false
                        this.getData()
                        // console.log(res)
                    }).catch((err)=>{console.log(err)})
                })
            }else{
                this.$message.warning('密码有误')
            }
            // this.editVisible = false;
            // console.log(row)
            // let url = 'good/'
            // deleteData()
        },
        // 分页导航
        handlePageChange(val) {
            console.log(val)
            this.tableData = undefined
            this.tableData = []
            let index = (val-1)*this.query.pageSize
            for(let i=index;i<this.query.pageSize+index&&i<this.goods.length;i++){
                this.tableData.push(this.goods[i])
            }
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
