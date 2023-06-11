import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix:true }
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/UserInformation',
    children: [{
      path: 'UserInformation',
      name: 'UserInformation',
      component: () => import('@/views/UserInformation/UserInformation'),
      meta: { title: '个人信息', icon: 'user' }
    }]
  },

  {
    path: '/CourseManage',
    component: Layout,
    redirect: '/CourseManage/MyCourse',
    name: 'CourseManage',
    meta: { title: '课程管理', icon: 'sys' },
    children: [
      
      {
        path: 'SelectCourse',
        name: 'SelectCourse',
        component: () => import('@/views/CourseManage/SelectCourse'),
        meta: { title: '个人选课', icon: 'roleManage' }
      },
      
      {
        path: 'CreateCourse',
        name: 'CreateCourse',
        component: () => import('@/views/CourseManage/CreateCourse'),
        meta: { title: '新建课程', icon: 'roleManage' }
      },
    ]
  },

  {
    path: '/LabManage',
    component: Layout,
    redirect: '/LabManage/Lab', //默认页面
    name: 'LabManage',
    meta: { title: '实验管理', icon: 'sys' },
    children: [
      {
        path: 'Lab',
        name: 'Lab',
        component: () => import('@/views/LabManage/Lab'),
        meta: { title: '实验管理', icon: 'userManage' }
      }
    ]
  },

  {
    path: '/GradeManage',
    component: Layout,
    redirect: '/GradeManage/MarkReport', //默认页面
    name: 'GradeManage',
    meta: { title: '成绩管理', icon: 'sys' },
    children: [
      {
        path: 'MarkReport',
        name: 'MarkReport',
        component: () => import('@/views/GradeManage/MarkReport'),
        meta: { title: '批阅实验报告', icon: 'userManage' }
      },
      {
        path: 'CourseGrade',
        name: 'CourseGrade',
        component: () => import('@/views/GradeManage/CourseGrade'),
        meta: { title: '学生个人成绩', icon: 'roleManage' }
      },
      {
        path: 'ClassGrade',
        name: 'ClassGrade',
        component: () => import('@/views/GradeManage/ClassGrade'),
        meta: { title: '班级成绩管理', icon: 'roleManage' }
      }
    ]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/role', //默认页面
    name: 'sysManage',
    meta: { title: '系统管理', icon: 'sys' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/sys/user'),
        meta: { title: '用户管理', icon: 'userManage' }
      }
      // {
      //   path: 'role',
      //   name: 'role',
      //   component: () => import('@/views/sys/role'),
      //   meta: { title: '角色管理', icon: 'roleManage' }
      // }
    ]
  },

  

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
