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
                <el-select v-model="query.condition" placeholder="请选择查询条件" class="handle-select mr10" style="width: 150px">
                    <el-option key="1" label="进货单编号" value="stockid"></el-option>
                    <el-option key="2" label="时间" value="time"></el-option>
                </el-select>
                <el-input
                    v-model="query.target"
                    placeholder="请输入搜索时间 如2008-09"
                    class="handle-input mr10"
                    v-if="query.condition==='time'"
                    style="width: 220px"
                ></el-input>
                <el-input
                    v-model="query.target"
                    placeholder="请输入订单编号"
                    class="handle-input mr10"
                    v-if="query.condition==='stockid'"
                    style="width: 220px"
                ></el-input>
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
                <el-table-column prop="id" label="进货单编号" align="center"></el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    :sortable="true"
                    :sort-method="sortByDate"
                ></el-table-column>
                <el-table-column
                    prop="totalPrice"
                    label="总价"
                    :sortable="true"
                    :sort-method="sortByTotalprice"
                ></el-table-column>
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
                condition: 'stockid',
                target: '',
                name: '',
                pageIndex: 1,
                pageSize: 20,
                date: '',
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
                this.pageTotal = this.tableData.length
                for(let i=0;i<this.tableData.length;i++){
                    let totalPrice = 0
                    let url = 'stock_info?stockId='+this.tableData[i].id
                    fetchData(url).then(res_=>{
                        for(let i=0;i<res_.data.length;i++){
                            totalPrice+=res_.data[i].goodNum * res_.data[i].goodPrice
                        }
                        this.tableData[i].totalPrice = totalPrice.toString()
                    })
                    this.tableData[i].createdAt = this.tableData[i].createdAt.substr(0,10);

                }
            });
        },
        sortByTotalprice(obj1, obj2){
            let val1 = obj1.totalPrice
            let val2 = obj2.totalPrice
            return val1-val2
        },
        sortByDate(obj1,obj2){
            let val1 = obj1.createdAt
            let val2 = obj2.createdAt
            return val1-val2
        },
        showDetail(stockId){
            let url = '../stockInfo/table?flag=false&stockId='+stockId;
            this.$router.push(url);
        },
        // 触发搜索按钮
        handleSearch() {
            this.tableData = undefined;
            this.tableData = [];
            if(this.query.condition==='stockid'){
                if(this.query.target===''){
                    this.tableData = this.allData
                }else{
                    for(let i=0;i<this.allData.length;i++){
                        if (this.allData[i].id.toString()===this.query.target){
                            this.tableData.push(this.allData[i])
                        }
                    }
                }
            }else if(this.query.condition==='time'){
                if(this.query.target===''){
                    this.tableData = this.allData
                }else if(this.query.target.length!==7 || this.query.target.substr(4,1)!=='-'){
                    this.$message.warning('时间输入格式错误，请重新输入')
                    this.query.target = ''
                    this.tableData = this.allData
                }else{
                    for(let i=0;i<this.allData.length;i++){
                        if (this.query.target===this.allData[i].createdAt.substr(0,7)){
                            this.tableData.push(this.allData[i])
                        }
                    }
                }
            }
            this.pageTotal = this.tableData.length
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
            this.$confirm("是否确认新建？",'提示', {
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
