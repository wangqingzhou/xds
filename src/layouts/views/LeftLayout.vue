<template>
  <BaseLayout>
    <!-- 左侧菜单栏 -->
    <div class="layout__sidebar" :class="{ 'layout__sidebar--collapsed': !isSidebarOpen }">
      <div :class="{ 'has-logo': isShowLogo }" class="layout-sidebar">
        <!-- Logo -->
        <div class="logo-container">
          <AppLogo v-if="isShowLogo" :collapse="!isSidebarOpen" />
          <div v-if="isShowLogo && !isSidebarOpen" class="logo-text">
            <h3>选调生管理系统</h3>
            <p>Student Selection System</p>
          </div>
        </div>
        <!-- 主菜单内容 -->
        <el-scrollbar>
          <div class="menu-container">
            <BasicMenu :data="routes" base-path="" />
          </div>
        </el-scrollbar>
        <!-- 底部信息 
        <div class="sidebar-footer">
          <div class="user-info">
            <el-avatar :size="32" src="https://placeholder.co/32x32?text=U" />
            <div class="user-details">
              <span class="user-name">管理员</span>
              <span class="user-role">超级管理员</span>
            </div>
          </div>
          <el-button type="text" class="collapse-btn" @click="isSidebarOpen = !isSidebarOpen">
            <el-icon :size="16">
              <component :is="isSidebarOpen ? 'Fold' : 'Expand'" />
            </el-icon>
          </el-button>
        </div>-->
      </div>
    </div>
    <!-- 主内容区 -->
    <div
      :class="{
        hasTagsView: isShowTagsView,
        'layout__main--collapsed': !isSidebarOpen,
      }"
      class="layout__main"
    >
      <!-- 顶部导航栏 -->
      <NavBar />
      <!-- 标签导航 -->
      <TagsView v-if="isShowTagsView" />
      <!-- 主内容区 -->
      <AppMain />
    </div>
  </BaseLayout>
</template>
<script setup lang="ts">
import { useLayout } from "../composables/useLayout";
import { useLayoutMenu } from "../composables/useLayoutMenu";
import BaseLayout from "./BaseLayout.vue";
import AppLogo from "../components/AppLogo/index.vue";
import NavBar from "../components/NavBar/index.vue";
import TagsView from "../components/TagsView/index.vue";
import AppMain from "../components/AppMain/index.vue";
import BasicMenu from "../components/Menu/BasicMenu.vue";
import { Fold, Expand } from "@element-plus/icons-vue";
// 布局相关参数
const { isShowTagsView, isShowLogo, isSidebarOpen } = useLayout();
// 菜单相关
const { routes } = useLayoutMenu();
</script>
<style lang="scss" scoped>
// 变量定义
$sidebar-width: 260px;
$sidebar-width-collapsed: 64px;
$navbar-height: 60px;
$tags-view-height: 34px;
.layout {
  &__sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: $sidebar-width;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &--collapsed {
      width: $sidebar-width-collapsed;
    }
    .layout-sidebar {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      &.has-logo {
        .el-scrollbar {
          height: calc(100vh - $navbar-height - 80px);
        }
      }
      :deep(.el-menu) {
        border: none;
        background: transparent;
        .el-menu-item {
          height: 50px;
          line-height: 50px;
          margin: 4px 8px;
          border-radius: 8px;
          transition: all 0.3s;
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #409eff;
          }
          &.is-active {
            background-color: #409eff;
            color: white;
            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
          }
          .el-icon {
            margin-right: 12px;
            font-size: 18px;
          }
        }
        .el-submenu {
          .el-submenu__title {
            height: 50px;
            line-height: 50px;
            margin: 4px 8px;
            border-radius: 8px;
            transition: all 0.3s;
            &:hover {
              background-color: rgba(255, 255, 255, 0.1);
              color: #409eff;
            }
            .el-icon {
              margin-right: 12px;
              font-size: 18px;
            }
          }
          .el-menu {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 0 0 8px 8px;
            .el-menu-item {
              margin: 2px 8px;
              background: transparent;
              &:hover {
                background-color: rgba(255, 255, 255, 0.05);
              }
            }
          }
        }
      }
    }
  }
  &__main {
    position: relative;
    height: 100vh;
    margin-left: $sidebar-width;
    overflow: hidden;
    background-color: #f5f7fa;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &--collapsed {
      margin-left: $sidebar-width-collapsed;
    }
    .fixed-header {
      position: sticky;
      top: 0;
      z-index: 9;
      transition: width 0.3s;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }
}
/* Logo 样式 */
.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  .logo-text {
    margin-left: 12px;
    color: white;
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    p {
      margin: 0;
      font-size: 11px;
      opacity: 0.7;
      font-weight: 400;
    }
  }
}
/* 菜单容器 */
.menu-container {
  flex: 1;
  padding: 8px 0;
}
/* 侧边栏底部 */
.sidebar-footer {
  height: 80px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    .user-details {
      display: flex;
      flex-direction: column;
      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: white;
      }
      .user-role {
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
  .collapse-btn {
    color: rgba(255, 255, 255, 0.7);
    padding: 8px;
    border-radius: 6px;
    transition: all 0.3s;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
}
/* 标签视图样式 */
.hasTagsView {
  :deep(.app-main) {
    height: calc(100vh - $navbar-height - $tags-view-height) !important;
    padding: 16px;
    background: #f5f7fa;
  }
  :deep(.tags-view) {
    background: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}
/* 移动端样式 */
.mobile {
  .layout__sidebar {
    width: $sidebar-width !important;
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      width 0s;
  }
  &.hideSidebar {
    .layout__sidebar {
      transform: translateX(-$sidebar-width);
    }
  }
  &.openSidebar {
    .layout__sidebar {
      transform: translateX(0);
    }
  }
  .layout__main {
    margin-left: 0 !important;
  }
}
/* 主内容区样式 */
:deep(.app-main) {
  height: calc(100vh - $navbar-height) !important;
  padding: 16px;
  background: #f5f7fa;
  overflow-y: auto;
}
/* 自定义滚动条 */
:deep(.el-scrollbar__bar.is-vertical) {
  width: 6px;
  .el-scrollbar__thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}
:deep(.el-scrollbar__bar.is-horizontal) {
  height: 6px;
  .el-scrollbar__thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}
/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.layout__sidebar {
  animation: slideIn 0.3s ease-out;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .layout__sidebar {
    width: $sidebar-width !important;
    .logo-text {
      display: none;
    }
    .sidebar-footer {
      .user-info {
        display: none;
      }
    }
  }
  .layout__main {
    margin-left: 0 !important;
  }
}
/* 暗色主题适配 */
html.dark {
  .layout__main {
    background-color: #1a1a1a;
  }
  :deep(.app-main) {
    background-color: #1a1a1a;
  }
  .hasTagsView {
    :deep(.app-main) {
      background-color: #1a1a1a;
    }
    :deep(.tags-view) {
      background: #2c2c2c;
      border-bottom-color: #3c3c3c;
    }
  }
}
</style>
