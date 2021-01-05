<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.condition" placeholder="请选择目标列" class="handle-select mr10">
                    <el-option key="1" label="订货单编号" value="orderid"></el-option>
                    <el-option key="2" label="购买的货物" value="goodName"></el-option>
                </el-select>
                <el-input v-model="query.target" placeholder="请输入筛选条件" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column width="55" align="center">
                    <template slot-scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" width="70" align="center" label="订货单编号"></el-table-column>
                <el-table-column prop="good.name" label="购买的货物">
                </el-table-column>
                <el-table-column
                    prop="buyNum"
                    label="购买数量"
                    :sortable="true"
                    :sort-method="sortByNum"
                ></el-table-column>
                <el-table-column prop="buyer.name" label="购买者">
                </el-table-column>
                <el-table-column
                    prop="totalPrice"
                    label="总价"
                    :sortable="true"
                    :sort-method="sortByTotalprice"
                ></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status==='已发货'?'success':(scope.row.status==='已付款'?'warning':'')"
                        >{{scope.row.status}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createAt" label="下单时间">
                    <template slot-scope="scope">
                        {{ scope.row.createdAt }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            @click="handleOrder(scope.$index, scope.row)"
                            v-if="scope.row.status!='已发货'"
                        >处理订单</el-button>
                        <el-button
                            type="text"
                            v-if="scope.row.status==='已发货'"
                            disabled
                        >已处理</el-button>
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

    </div>
</template>

<script>
import { fetchData } from '../../../api/index';
import { updateData } from "../../../api/index";

export default {
    name: 'basetable',
    data() {
        return {
            query: {
                condition:'orderid',
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 50,
                target: '',
            },
            allData:[],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            order:{
                status: '1'
            },
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData('order').then(res => {
                 console.log(res);
                 this.allData = res.data
                 this.tableData = res.data;
                 this.pageTotal = this.tableData.length
                 for(let i=0;i<this.tableData.length;i++){
                     this.tableData[i].totalPrice = this.tableData[i].buyNum * this.tableData[i].good.price
                     this.tableData[i].createdAt = this.tableData[i].createdAt.substr(0,10)
                     if(this.tableData[i].status==='1'){
                         this.tableData[i].status = '已发货'
                     }else if(this.tableData[i].status === '0'){
                         this.tableData[i].status = '已付款'
                     }
                 }
            });
        },
        sortByTotalprice(obj1,obj2){
            let val1 = obj1.totalPrice
            let val2 = obj2.totalPrice
            return val1-val2
        },
        sortByNum(obj1,obj2){
            let val1 = obj1.buyNum
            let val2 = obj2.buyNum
            return val1-val2
        },
        // 触发搜索按钮
        handleSearch() {
            this.tableData = undefined;
            this.tableData = [];
            console.log(this.allData)
            if(this.query.condition==='orderid'){
                if(this.query.target===''){
                    this.tableData = this.allData
                }else{
                    for(let i=0;i<this.allData.length;i++){
                        if (this.allData[i].id.toString()===this.query.target){
                            this.tableData.push(this.allData[i])
                        }
                    }
                }
                this.pageTotal = this.tableData.length
            }else if(this.query.condition==='goodName'){
                if(this.query.target===''){
                    this.tableData = this.allData
                    console.log('1')
                }else{
                    for(let i=0;i<this.allData.length;i++){
                        console.log(this.query.target)
                        if (this.allData[i].good.name.indexOf(this.query.target)>=0){
                            this.tableData.push(this.allData[i])
                        }
                    }
                }
                this.pageTotal = this.tableData.length
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
        handleAllSelection() {
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
        handleOrder(index, row) {
            this.$confirm('是否确认已发货？','提示',{
                type: "warning"
            }).then(()=>{
                let url = 'order/'+row.id
                updateData(url,this.order).then(res=>{
                    this.getData()
                })
            })
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
