<template>
    <div>
        <!-- 搜索栏-->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchModel.classId" placeholder="课程id" clearable></el-input>
                    <el-input v-model="searchModel.labId" placeholder="实验id" clearable></el-input>
                    <el-button @click="getLabList" type="primary" icon="el-icon-search" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <!-- 新增用户按钮 -->
                    <el-button @click="openEditUi(null)" type="primary" icon="el-icon-plus" circle></el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="labList" stripe style="width: 100%">
                <el-table-column label="#" width="50">
                    <!-- scope为当前元素 -->
                    <template slot-scope="scope">
                        <!-- (pageNo - 1) * pageSize + index + 1 -->
                        {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="classId" label="课程编号" width="100">
                </el-table-column>
                <el-table-column prop="className" label="课程名称" width="150">
                </el-table-column>
                <el-table-column prop="labId" label="实验id" width="100">
                </el-table-column>
                <el-table-column prop="labName" label="实验名称" width="150">
                </el-table-column>
                <el-table-column prop="introduction" label="实验简介" width="120">
                </el-table-column>
                <el-table-column label="实验报告" width="120">
                    <template slot-scope="scope">
                        <el-button @click="openUpReportUi(scope.row)" type="primary" icon="el-icon-upload2" size="mini"
                            circle></el-button>
                        <el-button @click="downReport(scope.row)" type="danger" icon="el-icon-download" size="mini"
                            circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="实验指导书" width="120">
                    <template slot-scope="scope">
                        <el-button @click="openUpGuidebookUi(scope.row.labId)" type="primary" icon="el-icon-upload2"
                            size="mini" circle></el-button>
                        <el-button type="danger" icon="el-icon-download" size="mini" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="openEditUi(scope.row.labId)" type="primary" icon="el-icon-edit" size="mini"
                            circle></el-button>
                        <el-button @click="deleteLab(scope.row)" type="primary" icon="el-icon-delete" size="mini"
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

        <!-- 实验信息编辑对话框 -->
        <el-dialog @close="clearForm('labForm')" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="labForm" ref="labFormRef" :rules="rules">
                <el-form-item label="课程id" prop="classId" :label-width="formLabelWidth">
                    <el-input v-model="labForm.classId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="className" :label-width="formLabelWidth">
                    <el-input v-model="labForm.className" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验id" prop="labId" :label-width="formLabelWidth">
                    <el-input v-model="labForm.labId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验名称" prop="labName" :label-width="formLabelWidth">
                    <el-input v-model="labForm.labName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="introduction" :label-width="formLabelWidth">
                    <el-input v-model="labForm.introduction" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveLab">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 上传实验报告信息编辑对话框 -->
        <el-dialog @close="clearForm('reportForm')" :title="reportTitle" :visible.sync="upReportDialogFormVisible">
            <el-form :model="reportForm" ref="reportFormRef">
                <el-form-item label="实验id" prop="labId" :label-width="formLabelWidth">
                    <el-input v-model="reportForm.labId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="学生id" prop="userId" :label-width="formLabelWidth">
                    <el-input v-model="reportForm.userId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验报告id" prop="reportId" :label-width="formLabelWidth">
                    <el-input v-model="reportForm.reportId" autocomplete="off" @blur="checkRadd"></el-input>
                </el-form-item>
                <el-form-item label="实验报告名称" prop="reportName" :label-width="formLabelWidth">
                    <el-input v-model="reportForm.reportName" autocomplete="off"></el-input>
                </el-form-item>
                <el-upload class="avatar-uploader" action="http://localhost:9999/report/buscode"
                    accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG" :show-file-list="false" :on-change="handleLicensePreview"
                    :before-upload="beforeLicenseUpload" :auto-upload="true" multiple :on-success="handleUploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="upReportDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveReport">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 上传实验指导书信息编辑对话框 -->
        <el-dialog @close="clearForm('guidebookForm')" :title="guidebookTitle" :visible.sync="upGuidebookDialogFormVisible">
            <el-form :model="guidebookForm" ref="guidebookFormRef">
                <el-form-item label="教师id" prop="userId" :label-width="formLabelWidth">
                    <el-input v-model="guidebookForm.userId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="实验指导书id" prop="guidebookId" :label-width="formLabelWidth">
                    <el-input v-model="guidebookForm.guidebookId" autocomplete="off" @blur="checkGadd"></el-input>
                </el-form-item>
                <el-form-item label="实验指导书名称" prop="guidebookName" :label-width="formLabelWidth">
                    <el-input v-model="guidebookForm.guidebookName" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="实验报告文件" prop="guidebookFile" :label-width="formLabelWidth">
                    <el-input v-model="guidebookForm.guidebookFile" autocomplete="off"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="upGuidebookDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGuidebook">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import labApi from '@/api/lab'
import reportApi from '@/api/report'
import guidebookApi from '@/api/guidebook'

export default {
    data() {
        return {
            formLabelWidth: '130px',
            labForm: {},
            reportForm: {},
            guidebookForm: {},

            add: '0',
            radd: '0',
            gadd: '0',
            // 对话框是否可见
            upReportDialogFormVisible: false,
            upGuidebookDialogFormVisible: false,
            dialogFormVisible: false,
            title: '',
            reportTitle: '上传实验报告',
            guidebookTitle: '上传实验指导书',
            total: 0,
            searchModel: {
                pageNo: 1,
                pageSize: 10
            },
            labList: [],
            // 数据验证
            rules: {
            },
            circleUrl: '',

        }

    },
    //方法
    methods: {
        downReport(lab) {
            let that = this;
            let name='1-2.png';
            reportApi.downReport(name).then(function (response) {
                let fileName = that.usercode
                let url = window.URL.createObjectURL(new Blob([response.data], {
                    type: "application/octet-stream"
                }));
                let a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                a.click();
                url = window.URL.revokeObjectURL(url);
                document.body.removeChild(a)
            })
        },
        handleUploadSuccess() {

        },
        beforeLicenseUpload(file) {
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            const whiteList = ["jpg", "jpeg", "png", "gif", "JPG", "JPEG"];
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$message.error('图片只能为jpg，png，gif类型');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error(this.inter.sctpdx + ' 2MB!');
                return false;
            }
        },
        handleLicensePreview(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('图片大小不能超过2MB!');
            } else {
                let fd = new FormData()//构建实例对象
                fd.append('file', file.raw)
                // 存储图片，点击确认按钮时统一上传
                // this.circleUrl = URL.createObjectURL(file.raw);
                // this.licenseFd = fd//这是上传到后端存储到数据库的文件名，或者可以理解为地址
            }
        },
        deleteLab(lab) {
            this.$confirm(`确定删除实验 ${lab.labName} ?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                labApi.deleteLabById(lab.labId).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getLabList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        saveLab() {
            alert(this.labForm.labId);
            // 触发表单验证
            this.$refs.labFormRef.validate((valid) => {
                if (valid) {
                    // 提交请求给后台                   
                    labApi.saveLab(this.labForm, this.add).then(response => {
                        // 成功提示
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新页面
                        this.getLabList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });


        },
        //检测实验报告是否已存在
        checkRadd() {
            reportApi.getReportById(this.reportForm.reportId).then(response => {
                if (response.data) {
                    this.radd = 0;
                    console.log('radd' + this.radd);
                }
                else {
                    this.radd = 1;
                    console.log('radd' + this.radd);

                };
            });
        },
        checkGadd() {
            guidebookApi.getGuidebookById(this.guidebookForm.guidebookId).then(response => {
                if (response.data) {
                    this.gadd = 0;
                    console.log('gadd' + this.gadd);
                }
                else {
                    this.gadd = 1;
                    console.log('gadd' + this.gadd);

                };
            });
        },
        saveReport() {
            alert(this.reportForm.reportId);
            // 触发表单验证
            this.$refs.reportFormRef.validate((valid) => {
                if (valid) {
                    // 提交请求给后台                   
                    reportApi.saveReport(this.reportForm, this.radd).then(response => {
                        // 成功提示
                        console.log('radd' + this.radd);
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.upReportDialogFormVisible = false;
                        // 刷新页面
                        //this.getReportList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        saveGuidebook() {
            alert(this.guidebookForm.guidebookId);
            // 触发表单验证
            this.$refs.guidebookFormRef.validate((valid) => {
                if (valid) {
                    // 提交请求给后台                   
                    guidebookApi.saveGuidebook(this.guidebookForm, this.gadd).then(response => {
                        // 成功提示
                        console.log('gadd' + this.gadd);
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.upGuidebookDialogFormVisible = false;
                        // 刷新页面
                        //this.getGuidebookList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 清除表单数据
        clearForm(form) {
            if (form == 'labForm') {
                console.log("clear labForm");
                this.labForm = {};
                this.$refs.labFormRef.clearValidate();
            } else if (form == 'reportForm') {
                console.log("clear reportForm");
                this.reportForm = {};
                this.$refs.reportFormRef.clearValidate();
            } else if (form == 'guidebookForm') {
                console.log("clear guidebookForm");
                this.guidebookForm = {};
                this.$refs.guidebookFormRef.clearValidate();
            };
        },
        openEditUi(labId) {
            // alert(labId);
            if (labId == null) {
                this.title = '新增实验';
                this.add = '1';

            } else {
                this.add = '0';
                this.title = '修改实验';
                // 根据id查询用户数据
                labApi.getLabById(labId).then(response => {
                    this.labForm = response.data;
                });
            }
            this.dialogFormVisible = true;
        },
        //打开上传实验报告界面
        openUpReportUi(lab) {

            this.upReportDialogFormVisible = true;
        },
        openUpGuidebookUi(lab) {

            this.upGuidebookDialogFormVisible = true;
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getLabList();

        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getLabList();

        },
        getLabList() {
            labApi.getLabList(this.searchModel).then(response => {
                this.labList = response.data.rows;
                this.total = response.data.total;
            });
        },
        removeLab(item) {
            var index = this.labForm.labs.indexOf(item)
            if (index !== -1) {
                this.labForm.labs.splice(index, 1)
            }
        },
        addLab() {
            this.labForm.labs.push({
                name: '',
                key: Date.now()
            })
        },

    },

    created() {
        this.getLabList();
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