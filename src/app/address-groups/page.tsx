"use client";

import { useState, useEffect } from "react";
import { GroupForm } from "./components/group-form";
import { GroupList } from "./components/group-list";
import { EditGroupDialog } from "./components/edit-group-dialog";
import type { AddressGroup } from "@/types";
import { api } from "@/lib/api";

export default function AddressGroups() {
  const [groups, setGroups] = useState<AddressGroup[]>([]);
  const [editingGroup, setEditingGroup] = useState<AddressGroup | null>(null);

  // 获取地址组列表
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await api.getGroups();
        setGroups(data);
      } catch (error) {
        console.error("获取地址组失败:", error);
        alert("获取地址组失败");
      }
    };
    fetchGroups();
  }, []);

  const handleCreateGroup = async (name: string) => {
    try {
      const result = await api.createGroup(name);
      setGroups((prev) => [...prev, result]);
      alert("地址组创建成功！");
    } catch (error) {
      console.error("创建地址组失败:", error);
      alert("创建地址组失败，请重试。");
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await api.deleteGroup(id);
      setGroups((prev) => prev.filter((group) => group._id !== id));
      alert("地址组删除成功！");
    } catch (error) {
      console.error("删除地址组失败:", error);
      alert("删除地址组失败，请重试。");
    }
  };

  const handleEditGroup = (group: AddressGroup) => {
    setEditingGroup(group);
  };

  const handleSaveGroup = async (updatedGroup: AddressGroup) => {
    try {
      const result = await api.updateGroup(
        updatedGroup._id,
        updatedGroup.name,
        updatedGroup.addresses || []
      );
      setGroups((prev) =>
        prev.map((group) =>
          group._id === result._id
            ? { ...result, addresses: updatedGroup.addresses }
            : group
        )
      );
      alert("地址组更新成功！");
    } catch (error) {
      console.error("更新地址组失败:", error);
      alert("更新地址组失败，请重试。");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">地址组管理</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <GroupForm onSubmit={handleCreateGroup} />
        </div>
        <div className="col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              分组列表
            </h2>
            <GroupList
              groups={groups}
              onDelete={handleDeleteGroup}
              onEdit={handleEditGroup}
            />
          </div>
        </div>
      </div>

      <EditGroupDialog
        group={editingGroup}
        open={!!editingGroup}
        onOpenChange={(open) => !open && setEditingGroup(null)}
        onSave={handleSaveGroup}
      />
    </div>
  );
}
