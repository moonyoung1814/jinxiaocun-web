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
                        <el-input v-model="good.name"></el-input>
                    </el-form-item>

                    <el-form-item label="库存数量" >
                        <el-input
                            style="width: 80px"
                            v-model="good.num"
                            :disabled="true"
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="货物介绍">
                        <el-input type="textarea" rows="5" v-model="good.introduction"></el-input>
                    </el-form-item>
                    <el-form-item label="零售单价">
                        <el-input
                            style="width: 80px"
                            v-model="good.price"
                            >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="图片路径">
                        <el-input v-model="good.picUrl"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {fetchData} from "@/api";
import { updateData } from "@/api";
import { addData } from "@/api";

export default {
    name: 'goodform',
    data() {
        return {
            value: '',
            desc: '',
            totalPrice: '0',
            good: {
                introduction: '',
                num: '0',
                name: '',
                picUrl: '',
                price: '',
            },
            form: {}
        };
    },
    created() {
        // this.getData(this.$route.query.id)
    },
    updated() {
        this.form.stockId = this.$route.query.stockId;
    },
    methods: {
        getData(id) {
            let url = 'good/'+id
            fetchData(url).then(res => {
                this.good = res.data[0];
                console.log(this.good)
            });
        },
        cancel(){
            this.$router.go(-1);
        },
        onSubmit() {
            this.form = this.good;
            // console.log(this.form)
            let url = 'good'
            this.$confirm('是否确认添加货物','提示', {
                type: 'warning'
            }).then(()=>{
                addData(url, this.form).then(res=>{
                    this.$message.success('新增成功')
                    this.$router.go(-1)
                }).catch((err)=>{
                    this.$message.warning('操作失败，请重新操作')
                })
            }).catch((err)=>{console.log(err)})
        },
    }
};
</script>
