import request from '@/utils/request'


export default {
  getReportList(searchModel) {
    return request({
      url: '/report/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        reportId: searchModel.reportId,
        reportName: searchModel.reportName

      }
    });
  },
  addReport(report) {
    return request({
      url: '/report',
      method: 'post',
      data: report
    });
  },
  updateReport(report) {
    return request({
      //url: '/report' + id,
      url: '/report',
      method: 'put',
      data: report
    });
  },
  saveReport(report, add) {
    //alert(report.reportId+report.password);
    if (add == '1') {
      return this.addReport(report);
    }
    return this.updateReport(report);
  },
  getReportById(reportId) {
    return request({
      // url: '/report' + id,
      url: `/report/${reportId}`,
      method: 'get'

    });
  },
  deleteReportById(reportId) {
    return request({
      // url: '/report' + id,
      url: `/report/${reportId}`,
      method: 'delete'

    });
  },
  downReport(name) {
    return request({
      method: 'get',
      url: `/report/downfile/${name}`,
      responseType: "arraybuffer"

    });
  },
}

