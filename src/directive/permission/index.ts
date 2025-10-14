import type { Directive, DirectiveBinding } from "vue";

import { useUserStore } from "@/store";
import { ROLE_ROOT } from "@/constants";

// -------------------------- 新增：通用权限检查函数 checkPerm --------------------------
/**
 * 通用权限检查函数（支持脚本中调用，如判断字段是否可编辑、接口是否可调用等）
 * @param requiredPerms 需检查的权限标识（单个字符串或数组，如 'material:edit' 或 ['material:edit', 'material:approve']）
 * @returns boolean - 是否拥有指定权限
 * @throws 当传入的权限标识不合法时抛出错误
 */
export const checkPerm = (requiredPerms: string | string[]): boolean => {
  // 1. 校验传入的权限标识合法性（与 hasPerm 指令逻辑一致）
  if (!requiredPerms || (typeof requiredPerms !== "string" && !Array.isArray(requiredPerms))) {
    throw new Error(
      "checkPerm 需提供合法权限标识！例如：checkPerm('sys:user:add') 或 checkPerm(['sys:user:add', 'sys:user:edit'])"
    );
  }

  const { roles, perms } = useUserStore().userInfo;

  // 2. 超级管理员（ROLE_ROOT）拥有所有权限，或权限标识包含 '*:*:*' 时直接放行（复用指令逻辑）
  if (
    roles.includes(ROLE_ROOT) ||
    (Array.isArray(requiredPerms) ? requiredPerms.includes("*:*:*") : requiredPerms === "*:*:*")
  ) {
    return true;
  }

  // 3. 核心权限判断（单个权限直接匹配，多个权限满足任一即可）
  return Array.isArray(requiredPerms)
    ? requiredPerms.some((perm) => perms.includes(perm))
    : perms.includes(requiredPerms);
};

// -------------------------- 原有：hasPerm 指令（可复用 checkPerm 逻辑优化） --------------------------
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const requiredPerms = binding.value;
    try {
      // 直接调用新增的 checkPerm 函数，避免重复代码
      const hasAuth = checkPerm(requiredPerms);
      // 无权限时移除元素
      if (!hasAuth && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    } catch (error) {
      // 捕获 checkPerm 抛出的参数错误，便于调试
      console.error("hasPerm 指令权限校验失败：", error);
      // 参数不合法时默认隐藏元素，避免展示无权限内容
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  },
};

// -------------------------- 原有：hasRole 指令 --------------------------
export const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const requiredRoles = binding.value;

    if (!requiredRoles || (typeof requiredRoles !== "string" && !Array.isArray(requiredRoles))) {
      throw new Error(
        "需要提供角色标识！例如：v-has-role=\"'ADMIN'\" 或 v-has-role=\"['ADMIN', 'TEST']\""
      );
    }

    const { roles } = useUserStore().userInfo;
    const hasAuth = Array.isArray(requiredRoles)
      ? requiredRoles.some((role) => roles.includes(role))
      : roles.includes(requiredRoles);

    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  },
};
