<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>进货项表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">

                    <el-form-item label="货物名称" >
                        <el-select placeholder="请选择" v-model="value" @change="goodChange(value)">
                            <el-option
                            v-for="item in goods"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="进货数量" >
                        <el-input style="width: 80px" v-model="form.goodNum" @change="numChange"></el-input>
                    </el-form-item>

                    <el-form-item label="文本框">
                        <el-input type="textarea" rows="5" v-model="desc" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="总价">
                        <el-input
                            style="width: 80px"
                            v-model="totalPrice"
                            :disabled="true"
                            >
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {fetchData} from "@/api";
import {addData} from "@/api";

export default {
    name: 'stockform',
    data() {
        return {
            goods: [],
            value:'',
            desc: '',
            totalPrice:'0',
            good: [],
            form: {
                goodNum: '',
                stockId: '',
                goodId: '',
                goodName: '',
                goodPrice: '',
            }
        };
    },
    created() {
        this.getData()
    },
    updated() {
        // this.getData();
        this.form.stockId = this.$route.query.stockId;
    },
    methods: {
        getData() {
            fetchData('good').then(res => {
                this.goods = res.data;
                // console.log(this.goods)
            });
        },
        onSubmit() {
            if(this.value === ''){
                this.$message.warning("货物名称不能为空")
            } else if(this.form.goodNum === ''){
                this.$message.warning("进货数量不能为空")
            }else{
                this.$confirm('提交后无法修改', '提示', {
                    type: 'warning'
                }).then(() => {
                    addData('stock_info',this.form).then(res =>{
                        this.$message.success('提交成功');
                    }).catch((err) => {console.log(err)})
                    // console.log(this.value)
                }).catch(() => {});
            }
        },
        goodChange(value){
            value = value - 1
            this.good = this.goods[value]
            this.desc = this.good['introduction']
            this.form.goodId = this.good.id
            this.form.goodId = this.form.goodId
            this.form.goodName = this.goods[value].name;
            this.numChange()
        },
        numChange(){
            if(this.good['price']){
                this.totalPrice = this.form.goodNum * this.good['price']
                this.form.goodPrice = this.totalPrice
            }else{
                this.totalPrice = '0'
            }
            // console.log(this.form)
        }
    }
};
</script>
