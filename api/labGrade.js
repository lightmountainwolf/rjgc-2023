import request from '@/utils/request'


export default{
  getLabGradeList(searchModel){
    return request({
      url: '/labGrade/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        classId: searchModel.classId,
        userId: searchModel.userId
      }
    });
  },
  getLabGradeByUserIdLabId(labGradeSearchModel){
    return request({
      // url: '/labGrade' + id,
      url: '/labGrade/labGrade',
      params:{       
        userId: labGradeSearchModel.userId,
        labId: labGradeSearchModel.labId
      }
      
    });
  },
  addLabGrade(labGrade){
    return request({
      url: '/labGrade',
      method: 'post',
      data: labGrade
    });
  },
  updateLabGrade(labGrade){
    return request({
      //url: '/labGrade' + id,
      url: '/labGrade',
      method: 'put',
      data: labGrade     
    });
  },
  saveLabGrade(labGrade,add){
    //alert(labGrade.labGradeId+labGrade.password);
    if(add=='1'){
      return this.addLabGrade(labGrade);
    }
    return this.updateLabGrade(labGrade);
  },
  getLabGradeById(userId){
    return request({
      // url: '/labGrade' + id,
      url: `/labGrade/${userId}`,
      method: 'get'
      
    });
  },
  deleteLabGradeById(userId){
    return request({
      // url: '/labGrade' + id,
      url: `/labGrade/${userId}`,
      method: 'delete'
      
    });
  }
}

