import request from '@/utils/request'


export default{
  getLabList(searchModel){
    return request({
      url: '/lab/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        classId: searchModel.classId,
        labId: searchModel.labId
        
      }
    });
  },
  addLab(lab){
    return request({
      url: '/lab',
      method: 'post',
      data: lab
    });
  },
  updateLab(lab){
    return request({
      //url: '/lab' + id,
      url: '/lab',
      method: 'put',
      data: lab     
    });
  },
  saveLab(lab,add){
    //alert(lab.labId+lab.password);
    if(add=='1'){
      return this.addLab(lab);
    }
    return this.updateLab(lab);
  },
  getLabById(labId){
    return request({
      // url: '/lab' + id,
      url: `/lab/${labId}`,
      method: 'get'
      
    });
  },
  deleteLabById(labId){
    return request({
      // url: '/lab' + id,
      url: `/lab/${labId}`,
      method: 'delete'
      
    });
  }
}
