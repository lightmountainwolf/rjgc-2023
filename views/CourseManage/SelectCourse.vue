<template>
    <div>
        <!-- 搜索栏-->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.classId" placeholder="课程Id" clearable></el-input>
                    <el-input v-model="searchModel.userId" placeholder="学号" clearable></el-input>
                    <el-button @click="getGradeList" type="primary" icon="el-icon-search" round>查询我的课程</el-button>
                </el-col>
                <el-button @click="openEditUi" type="primary" icon="el-icon-s-order" round>个人选课</el-button>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="gradeList" stripe style="width: 100%">
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
                    <!-- <template >
                        {{ '1' + temp[1].className }}
                    </template> -->
                </el-table-column>
                <el-table-column prop="userId" label="学号" width="100">
                </el-table-column>
                <!-- <el-table-column prop="labNumber" label="实验数量" width="100">
                </el-table-column> -->
                <el-table-column  label="退课" width="100">
                    <template slot-scope="scope">
                        <el-button @click="dropClass(scope.row)" type="primary" icon="el-icon-delete" size="mini"
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

        <!--用户信息编辑对话框-->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
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
                    <el-table-column>
                        <template slot-scope="scope1">
                            <el-checkbox  @change="selectCourse(scope1.row.classId)"></el-checkbox>
                        </template>                        
                    </el-table-column>
                </el-table>
            </el-card>

            <div slot="footer" class="dialog-footer">

                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import classApi from '@/api/class'
import gradeApi from '@/api/grade'
//import { forEach } from 'mock/user'
export default {
    data: {
        //temp:'1',
    },
    data() {


        return {
            formLabelWidth: '130px',
            gradeForm: {
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
            gradeList: [],
            temp:[{ classId: '', userId: '', grade: '', className: '', labNumber:'' }],
            checked:false,
            classList: [],

            courrentUserId:'',
            // 数据验证
            rules: {}
        }
    },
    methods: {
        dropClass(grade) {
            this.$confirm(`确定退课 ${grade.className} ?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                gradeApi.dropClassById(grade.userId,grade.classId).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getGradeList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        saveGrade() {
            // 关闭对话框
            this.dialogFormVisible = false;
            // 刷新页面
            this.getGradeList();
        },
        // 清除表单数据
        clearForm() {
            this.classList = {};
            //this.$refs.gradeFormRef.clearValidate();
        },
        openEditUi(userId) {
            classApi.getClassList(this.searchModel).then(response => {
                this.classList = response.data.rows;
                this.total = response.data.total;
            });
            this.dialogFormVisible = true;
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getGradeList();

        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getGradeList();

        },
        getGradeList() { 
            this.courrentUserId=this.searchModel.userId;
            gradeApi.getGradeList(this.searchModel).then(response => {
                this.temp = response.data.rows;
                let a;
                //根据课程Id获取课程信息
                for (let i = 0; i < this.temp.length; i++) {
                    a =this.temp[i];
                    classApi.getClassById(a.classId).then(response =>{
                        this.temp[i].className = response.data.className;
                        this.temp[i].labNumber = response.data.labNumber;
                    })
                };
                this.gradeList=this.temp;
                this.total = response.data.total;
            });
        },
        selectCourse(classId){
            //
            console.log(this.courrentUserId);
            let id='1753238';
            gradeApi.selectCourse(id,classId);
        }
    },
    created() {
        this.getGradeList();
    }

}
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