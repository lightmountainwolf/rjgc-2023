import request from '@/utils/request'


export default{
  getGradeList(searchModel){
    return request({
      url: '/grade/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        classId: searchModel.classId,
        userId: searchModel.userId
      }
    });
  },
  selectCourse(userId,classId){
    return request({
      url: `/grade/selectCourse/${userId,classId}`,
      method: 'delete',    
    });
  },
  dropClassById(userId,classId){
    return request({
      // url: '/user' + id,
      url: `/grade/${userId,classId}`,
      method: 'delete'     
    });
  }
}

