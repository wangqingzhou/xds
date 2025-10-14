import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layouts/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true },
      },
      {
        path: "news/create",
        name: "NewsCreate",
        component: () => import("@/views/system/news/components/NewsForm.vue"),
        meta: {
          title: "新增",
          hidden: true,
        },
      },
      {
        path: "news/edit/:id",
        name: "NewsEdit",
        component: () => import("@/views/system/news/components/NewsForm.vue"),
        meta: {
          title: "编辑",
          hidden: true,
        },
        props: true,
      },
      {
        path: "materials",
        name: "Materialse",
        component: () => import("@/views/system/materials/index.vue"),
        meta: {
          title: "新建申请",
          hidden: true,
        },
      },
      {
        path: "materials/edit/:id",
        name: "Materialsedit",
        component: () => import("@/views/system/materials/index.vue"),
        meta: {
          title: "编辑申请",
          hidden: true,
        },
        props: true,
      },
      {
        path: "materials/view/:id",
        name: "Materialsview",
        component: () => import("@/views/system/materials/components/AuditDetailDialog.vue"),
        meta: {
          title: "查看申请",
          hidden: true,
        },
        props: true,
      },
      {
        path: "/system/materials/list",
        name: "MaterialList", // 这里必须与代码中使用的名称一致
        component: () => import("@/views/system/materials/list.vue"),
        meta: {
          title: "申请列表",
          hidden: true,
        },
      },
      {
        path: "my-notice",
        name: "MyNotice",
        component: () => import("@/views/system/notice/components/MyNotice.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true },
      },
    ],
  },
];
export const asyncRoutes: RouteRecordRaw[] = [
  //export const asyncRoutes = [
  {
    path: "/articlemanager",
    component: Layout,
    redirect: "/permission/page",
    //   alwaysShow: true, // will always show the root menu
    name: "Articlemanager",
    meta: {
      title: "articlemanager",
      icon: "document",
      roles: ["ROLE_ROOT", "ROLE_editor"], // you can set roles in root nav
    },
    children: [
      {
        path: "articlelist",
        component: () => import("@/views/system/news/index.vue"),
        name: "Articlelist",
        meta: {
          title: "articlelist",
          roles: ["ROLE_ROOT", "ROLE_editor"], // you can set roles in root nav
          icon: "el-icon-Reading",
        },
      },
      {
        path: "classmanager",
        component: () => import("@/views/system/class/index.vue"),
        name: "Classmanager",
        meta: {
          title: "classmanager",
          // if do not set roles, means: this page does not require permission
          icon: "collapse",
        },
      },
      {
        path: "deptmanager",
        component: () => import("@/views/system/dept/index.vue"),
        name: "Deptmanager",
        meta: {
          title: "deptmanager",
          // if do not set roles, means: this page does not require permission
          icon: "tree",
        },
      },
      {
        path: "dicttreemanager",
        component: () => import("@/views/system/dicttree/index.vue"),
        name: "Dicttreemanager",
        meta: {
          title: "dicttreemanager",
          // if do not set roles, means: this page does not require permission
          icon: "dict",
        },
      },
      {
        path: "usermanager",
        component: () => import("@/views/system/user/index.vue"),
        name: "Usermanager",
        meta: {
          title: "usermanager",
          roles: ["ROLE_ROOT", "ROLE_editor"],
          icon: "el-icon-User",
        },
      },
      {
        path: "rolemanager",
        component: () => import("@/views/system/role/index.vue"),
        name: "Rolemanager",
        meta: {
          title: "rolemanager",
          roles: ["ROLE_ROOT", "ROLE_editor"],
          icon: "role",
        },
      },
      {
        path: "unitmanager",
        component: () => import("@/views/system/unit/index.vue"),
        name: "Unitmanager",
        meta: {
          title: "unitmanager",
          roles: ["ROLE_ROOT", "ROLE_editor"],
          icon: "client",
        },
      },
      {
        path: "menumanager",
        component: () => import("@/views/system/menu/index.vue"),
        name: "Menumanager",
        meta: {
          title: "menumanager",
          roles: ["ROLE_ROOT", "ROLE_editor"],
          icon: "menu",
        },
      },
      {
        path: "logmanager",
        component: () => import("@/views/system/log/index.vue"),
        name: "Logmanager",
        meta: {
          title: "logmanager",
          roles: ["ROLE_ROOT", "ROLE_editor"],
          icon: "document",
        },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  {
    path: "/:pathMatch(.*)*", // 使用参数和正则表达式
    redirect: "/404",
    hidden: true,
  },
];
/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
