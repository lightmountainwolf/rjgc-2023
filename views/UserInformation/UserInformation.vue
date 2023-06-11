<template>
    <el-descriptions class="margin-top"  :column="3" :size="size" border>
        <template slot="extra">
          <el-button type="primary" size="small">修改用户</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ userName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            学工号
          </template>
          {{userId}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              电话号码
            </template>
            {{phoneNumber}}
          </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            性别
          </template>
          {{gender}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              用户类型
            </template>
            {{userType}}
          </el-descriptions-item>
        
      </el-descriptions>
</template>

<script>
import userApi from '@/api/userManage';
export default {
    data() {
        

        return{
            dialogFormVisible:true,
            size:'medium',
            userName: 159,
            userId:1753238,
            phoneNumber:'',
            gender:'',
            userType:'',
        
        }

    },
    methods:{
       getUser(){
        userApi.getUserById(this.userId).then(response =>{
                    this.userName = response.data.userName;
                    this.userId=response.data.userId;
                    this.phoneNumber=response.data.phoneNumber;
                    this.gender=response.data.gender;
                    this.userType=response.data.userType;

                });
       }

    },
    created(){
        this.getUser();
    }
}
</script>

<style>

</style>