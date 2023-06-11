<template>
    <div>
        <!-- 搜索栏-->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.classId" placeholder="课程id" clearable></el-input>
                    <el-input v-model="searchModel.userId" placeholder="学生id" clearable></el-input>
                    <el-button @click="getGradeList" type="primary" icon="el-icon-search" round>查询</el-button>
                </el-col>
                
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
                <el-table-column prop="classId" label="课程ID" width="100">
                </el-table-column>
                <el-table-column prop="className" label="课程名称" width="100">
                </el-table-column>
                <el-table-column prop="userId" label="学工号" width="100">
                </el-table-column>
                <el-table-column prop="grade" label="课程成绩" width="200">
                </el-table-column>

            </el-table>
        </el-card>


        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 40]" :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>


<script>
import gradeApi from '@/api/grade'
import labGradeApi from '@/api/labGrade'
export default {
    data() {
        return {
            isShowLabGrade: false,
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
            labGradeSearchModel: {
                userId: '',
                classId: '',
                pageNo: 1,
                pageSize: 10
            },
            gradeList: [],
            labGradeList: [],
            // 数据验证
            rules: {}

        }
    },
    methods: {

        // 清除表单数据
        clearForm() {
            this.gradeForm = {};
            this.$refs.gradeFormRef.clearValidate();
        },
        clearLabGradeForm() {
            this.labGradeForm = {};
            this.$refs.labGradeFormRef.clearValidate();
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
            gradeApi.getGradeList(this.searchModel).then(response => {
                this.gradeList = response.data.rows;
                this.total = response.data.total;
            });
        },
        getLabGradeList(grade) {
            //this.isShowLabGrade = true;
            console.log(this.isShowLabGrade);
            this.labGradeSearchModel.classId = grade.classId;
            this.labGradeSearchModel.userId = grade.userId;
            labGradeApi.getLabGradeList(this.labGradeSearchModel).then(response => {
                this.labGradeList = response.data.rows;
                this.total = response.data.total;
            });
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