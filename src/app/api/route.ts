// API 路由设计
export const routes = {
  // 地址组相关
  "GET /api/groups": "获取所有地址组",
  "GET /api/groups/:id": "获取单个地址组详情",
  "POST /api/groups": "创建地址组",
  "PUT /api/groups/:id": "更新地址组",
  "DELETE /api/groups/:id": "删除地址组",

  // 地址相关
  "POST /api/groups/:id/addresses": "添加地址到组",
  "DELETE /api/groups/:id/addresses/:addressId": "从组中删除地址",

  // 空投记录相关
  "GET /api/airdrops": "获取空投记录列表",
  "GET /api/airdrops/:id": "获取空投记录详情",
  "POST /api/airdrops": "创建空投记录",
};
