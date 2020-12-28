<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    icon="el-icon-plus"
                    @click="newStock"
                >新增</el-button>
                <el-input v-model="query.year" placeholder="请输入年份" class="handle-input mr10"></el-input>
                <el-input v-model="query.month" placeholder="请输入月份" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name = "table-header"
                @selection-change = "handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column fixed label="序号" width="55" align="center">
                    <template scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="进货单编号" align="center" width="110"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="100"></el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="110"></el-table-column>
                <el-table-column prop="ps" label="备注"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            @click="showDetail(scope.row['id'])"
                            icon="el-icon-info"
                            type="text"
                        >
                            查看详情
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
                    :total = "pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchData} from "@/api";
import { addData} from "@/api";

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                year: '',
                month: '',
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            allData: [],
            stockId: '',
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
    computed:{
        onRouter(){
            this.$route.path.replace("/","/stockInfoTable?id="+this.id)
        },
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData("stock").then(res => {
                this.tableData = res.data;
                this.allData = res.data;
                for(let i=0;i<this.tableData.length;i++){
                    let totalPrice = 0
                    let url = 'stock_info?stockId='+this.tableData[i].id
                    fetchData(url).then(res_=>{
                        for(let i=0;i<res_.data.length;i++){
                            totalPrice+=res_.data[i].goodNum * res_.data[i].goodPrice
                        }
                        this.tableData[i].totalPrice = totalPrice.toString()
                        if(this.tableData[i].totalPrice==='0'){
                            this.tableData[i].ps='ps:此订单为空'
                        }
                    })
                    this.tableData[i].createdAt = this.tableData[i].createdAt.substr(0,10);
                }
                // this.pageTotal = res.pageTotal || 50;
            });
            // let totalPrice=0
            // fetchData('stock_info?stockId=14').then(res =>{
            //     console.log(res.data)
            //     for(let i=0;i<res.data.length;i++){
            //         totalPrice += res.data[i].goodNum * res.data[i].goodPrice
            //     }
            //     console.log(totalPrice)
            // })
        },
        showDetail(stockId){
            let url = '../stockInfo/table?flag=false&stockId='+stockId;
            this.$router.push(url);
        },
        // 触发搜索按钮
        handleSearch() {
            this.tableData = undefined;
            this.tableData = [];
            if(this.query.month.length===1){
                this.query.month = "0"+this.query.month;
            }
            let date = this.query.year + "-" + this.query.month;
            if(date==="-"){
                this.tableData = this.allData;
            }else if(date.length===5){
                for(let i=0;i<this.allData.length;i++){
                    if(date===this.allData[i].createdAt.substr(0,5)){
                        this.tableData.push(this.allData[i])
                    }
                }
            }else if(date.length===3){
                this.$message.warning("年份不能为空");
            }else{
                for(let i=0;i<this.allData.length;i++){
                    if(date===this.allData[i].createdAt.substr(0,7)){
                        this.tableData.push(this.allData[i])
                    }
                }
            }

        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            console.log(this.form)
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
        },
        newStock(){
            this.$confirm("新建进货单后无法删除，是否确认新建？",'提示', {
                type: 'warning'
            }).then(()=>{
                addData('stock', this.form).then(res =>{
                    // 后续修改，数据存储在data中
                    this.stockId = res.message;
                    let url = '../stockInfo/table?flag=true&stockId='+this.stockId;
                    this.$router.push(url);
                    this.$message.success('新建成功');
                }).catch((err) => {console.log(err)})
            }).catch(() => {})
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
    width: 100px;
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
