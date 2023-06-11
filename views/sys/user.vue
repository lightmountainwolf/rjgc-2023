<template>
    <div>
        <!-- 搜索栏-->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.userName" placeholder="用户名" clearable></el-input>
                    <el-input v-model="searchModel.phoneNumber" placeholder="电话号码" clearable></el-input>
                    <el-button @click="getUserList" type="primary" icon="el-icon-search" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <!-- 新增用户按钮 -->
                    <el-button @click="openEditUi(null)" type="primary" icon="el-icon-plus" circle></el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="userList" stripe style="width: 100%">
                <el-table-column label="#" width="50">
                    <!-- scope为当前元素 -->
                    <template slot-scope="scope">
                        <!-- (pageNo - 1) * pageSize + index + 1 -->
                        {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="学工号" width="100">
                </el-table-column>
                <el-table-column prop="userName" label="姓名" width="100">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="50">
                </el-table-column>
                <el-table-column prop="phoneNumber" label="电话" width="120">
                </el-table-column>
                <el-table-column prop="userType" label="用户类型" width="100">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="openEditUi(scope.row.userId)" type="primary" icon="el-icon-edit" size="mini"
                            circle></el-button>
                        <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini"
                            circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 40]" :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 用户信息编辑对话框 -->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="userForm" ref="userFormRef" :rules="rules">
                <el-form-item label="学工号" prop="userId" :label-width="formLabelWidth">
                    <el-input v-model="userForm.userId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="userName" :label-width="formLabelWidth">
                    <el-input v-model="userForm.userName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="add == '1'" label="登陆密码" prop="password" :label-width="formLabelWidth">
                    <el-input type="password" v-model="userForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                    <el-input v-model="userForm.gender" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phoneNumber" :label-width="formLabelWidth">
                    <el-input v-model="userForm.phoneNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="userType" :label-width="formLabelWidth">
                    <el-input v-model="userForm.userType" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUser">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
// 引入api
import userApi from '@/api/userManage'
export default {
    data() {
        var checkPhoneNumber = (rule, value, callback) => {
            let reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
            if (!reg_tel.test(value) & value != null) {
                return callback(new Error('请输入正确的号码'));
            }
            callback();
        };
        var checkGender = (rule, value, callback) => {
            let reg = /^[男|女]{1}$/;
            if (!reg.test(value) & value != null) {
                return callback(new Error('请输入正确的性别'));
            }
            callback();
        };
        var checkUserType = (rule, value, callback) => {

            if ((!(value == '管理员' | value == '学生' | value == '教师')) & value != null) {
                return callback(new Error('请输入以下表中的用户类型：管理员，学生，教师'));
            }
            callback();
        };
        return {

            formLabelWidth: '130px',
            userForm: {
                //add: "0"
            },
            add: '0',
            // 对话框是否可见
            dialogFormVisible: false,
            title: '',
            total: 0,
            searchModel: {
                pageNo: 1,
                pageSize: 10
            },
            userList: [],
            // 数据验证
            rules: {
                userName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                userId: [
                    { required: true, message: '请输入学工号', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                phoneNumber: [
                    { required: false, message: '电话号码', trigger: 'blur' },
                    { validator: checkPhoneNumber, trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请输入性别', trigger: 'blur' },
                    { validator: checkGender, trigger: 'blur' }
                ],
                userType: [
                    { required: true, message: '请输入用户类型', trigger: 'blur' },
                    { validator: checkUserType, trigger: 'blur' }
                ]

            }
        }
    },
    // 方法
    methods: {
        deleteUser(user) {
            this.$confirm(`确定删除用户 ${user.userName} ?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                userApi.deleteUserById(user.userId).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getUserList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        saveUser() {
            //alert(this.userForm.userId);
            // 触发表单验证
            this.$refs.userFormRef.validate((valid) => {
                if (valid) {
                    // 提交请求给后台                   
                    userApi.saveUser(this.userForm, this.add).then(response => {
                        // 成功提示
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新页面
                        this.getUserList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });


        },
        // 清除表单数据
        clearForm() {
            this.userForm = {};
            this.$refs.userFormRef.clearValidate();
        },
        openEditUi(userId) {
            // alert(userId);
            if (userId == null) {
                this.title = '新增用户';
                this.add = '1';

            } else {
                this.add = '0';
                this.title = '修改用户';
                // 根据id查询用户数据
                userApi.getUserById(userId).then(response => {
                    this.userForm = response.data;
                });
            }
            this.dialogFormVisible = true;
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getUserList();

        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getUserList();

        },
        getUserList() {
            userApi.getUserList(this.searchModel).then(response => {
                this.userList = response.data.rows;
                this.total = response.data.total;
            });
        }

    },
    created() {
        this.getUserList();
    }
};
</script>

<style>
#search .el-input {
    width: 200px;
    margin-right: 10px;
}

.el-dialog .el-input {
    width: 50%;
}
</style>