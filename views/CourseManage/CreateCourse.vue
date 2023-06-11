<template>
    <div>
        <!-- 搜索栏-->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.classId" placeholder="课程id" clearable></el-input>
                    <el-input v-model="searchModel.className" placeholder="课程名称" clearable></el-input>
                    <el-button @click="getClassList" type="primary" icon="el-icon-search" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <!-- 新增用户按钮 -->
                    <el-button @click="openEditUi(null)" type="primary" icon="el-icon-plus" circle></el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="classList" stripe style="width: 100%">
                <el-table-column label="#" width="50">
                    <!-- scope为当前元素 -->
                    <template slot-scope="scope">
                        <!-- (pageNo - 1) * pageSize + index + 1 -->
                        {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="classId" label="课程编号" width="100">
                </el-table-column>
                <el-table-column prop="className" label="课程名称" width="100">
                </el-table-column>
                <el-table-column prop="userId" label="教师id" width="100">
                </el-table-column>
                <el-table-column prop="introduction" label="课程简介" width="120">
                </el-table-column>
                <el-table-column prop="labNumber" label="实验数量" width="100">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="openEditUi(scope.row.classId)" type="primary" icon="el-icon-edit" size="mini"
                            circle></el-button>
                        <el-button @click="deleteClass(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 40]" :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 课程信息编辑对话框 -->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="classForm" ref="classFormRef" :rules="rules">
                <el-form-item label="课程id" prop="classId" :label-width="formLabelWidth">
                    <el-input v-model="classForm.classId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="className" :label-width="formLabelWidth">
                    <el-input v-model="classForm.className" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="教师id" prop="userId" :label-width="formLabelWidth">
                    <el-input v-model="classForm.userId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="introduction" :label-width="formLabelWidth">
                    <el-input v-model="classForm.introduction" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验数量" prop="labNumber" :label-width="formLabelWidth">
                    <el-input v-model="classForm.labNumber" autocomplete="off"></el-input>
                </el-form-item>
                <!--动态表单-->
                <el-form-item v-for="(lab, index) in classForm.labs" :label="'实验' + index" :key="lab.key"
                    :prop="'labs.' + index + '.value'" :rules="{
                            require: true, message: '实验名不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="lab.value"></el-input><el-button @click.prevent="removeLab(lab)">删除</el-button>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addLab">新增实验</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClass">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// 引入api
import classApi from '@/api/class'
export default {
    data() {
        return {
            formLabelWidth: '130px',
            classForm: {
                labs:[{
                        name:'',
                    }]
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
            classList: [],
            // 数据验证
            rules: {


            }
        }

    },
    //方法
    methods: {
        deleteClass(course) {
            this.$confirm(`确定删除课程 ${course.className} 和它的实验 ?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                classApi.deleteClassById(course.classId).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getClassList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '删除失败，删除课程下的实验和学生试试？'
                });
            });
        },
        saveClass() {
            alert(this.classForm.classId);
            // 触发表单验证
            this.$refs.classFormRef.validate((valid) => {
                if (valid) {
                    // 提交请求给后台                   
                    classApi.saveClass(this.classForm, this.add).then(response => {
                        // 成功提示
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新页面
                        this.getClassList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });


        },
        // 清除表单数据
        clearForm() {
            this.classForm = {};
            this.$refs.classFormRef.clearValidate();
        },
        openEditUi(classId) {
            // alert(classId);
            if (classId == null) {
                this.title = '新增课程';
                this.add = '1';

            } else {
                this.add = '0';
                this.title = '修改课程';
                // 根据id查询用户数据
                classApi.getClassById(classId).then(response => {
                    this.classForm = response.data;
                });
            }
            this.dialogFormVisible = true;
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getClassList();

        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getClassList();

        },
        getClassList() {
            classApi.getClassList(this.searchModel).then(response => {
                this.classList = response.data.rows;
                this.total = response.data.total;
            });
        },
        removeLab(item) {
            var index = this.classForm.labs.indexOf(item)
            if (index !== -1) {
                this.classForm.labs.splice(index, 1)
            }
        },
        addLab() {
            this.classForm.labs.push({
                name: '',
                key: Date.now()
            })
        },

    },

    created() {
        this.getClassList();
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