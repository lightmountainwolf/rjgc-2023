<template>
    <div>
        <!-- 搜索栏-->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.reportId" placeholder="实验报告id" clearable></el-input>
                    <el-input v-model="searchModel.userId" placeholder="学生id" clearable></el-input>
                    <el-button @click="getReportList" type="primary" icon="el-icon-search" round>查询</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="reportList" stripe style="width: 100%">
                <el-table-column label="#" width="50">
                    <!-- scope为当前元素 -->
                    <template slot-scope="scope">
                        <!-- (pageNo - 1) * pageSize + index + 1 -->
                        {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="reportId" label="实验报告ID" width="100">
                </el-table-column>
                <el-table-column prop="labId" label="实验ID" width="100">
                </el-table-column>
                <el-table-column prop="userId" label="学工号" width="100">
                </el-table-column>
                <el-table-column prop="reportName" label="实验报告名称" width="200">
                </el-table-column>
                <el-table-column prop="reportGrade" label="实验报告成绩" width="200">
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <el-button @click="downloadReport(scope.row)" type="primary" icon="el-icon-download" size="mini"
                            circle></el-button>
                        <el-input v-model="reportGradeInput"  @blur="markReport(scope.row)" placeholder="请输入实验报告评分"></el-input>
                        
                    </template>
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
import reportApi from '@/api/report'
export default {
    data() {
        return {
            reportGradeInput:'',
            formLabelWidth: '130px',
            reportForm: {
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
            reportList: [],
            // 数据验证
            rules:{}

        }
    },
    methods: {
        markReport(report){
            if(this.reportGradeInput){
                console.log(report.reportGrade);
                report.reportGrade=this.reportGradeInput;
                reportApi.updateReport(report).then(response =>{
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getReportList();
                });
            };
        },
        downloadReport(report){

        },
         // 清除表单数据
        clearForm() {
            this.reportForm = {};
            this.$refs.reportFormRef.clearValidate();
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getReportList();

        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getReportList();

        },
        getReportList() {
            reportApi.getReportList(this.searchModel).then(response => {
                this.reportList = response.data.rows;
                this.total = response.data.total;
            });
        }

    },
    created() {
        this.getReportList();
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