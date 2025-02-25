"use client";

import { AddressGroup } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface GroupListProps {
  groups: AddressGroup[];
  onDelete?: (id: string) => void;
  onEdit?: (group: AddressGroup) => void;
  selectable?: boolean;
  onImport?: (group: AddressGroup, selectedAddresses?: string[]) => void;
}

export function GroupList({
  groups = [],
  onDelete,
  onEdit,
  selectable = false,
  onImport,
}: GroupListProps) {
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedAddresses, setSelectedAddresses] = useState<Set<string>>(
    new Set()
  );

  const handleSelectGroup = (groupId: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.size === groups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(groups.map((g) => g._id)));
    }
  };

  const handleExpandGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
    setSelectedAddresses(new Set());
  };

  const handleSelectAddress = (address: string) => {
    const newSelected = new Set(selectedAddresses);
    if (newSelected.has(address)) {
      newSelected.delete(address);
    } else {
      newSelected.add(address);
    }
    setSelectedAddresses(newSelected);
  };

  const handleSelectAllAddresses = (addresses: string[]) => {
    if (selectedAddresses.size === addresses.length) {
      setSelectedAddresses(new Set());
    } else {
      setSelectedAddresses(new Set(addresses));
    }
  };

  const handleImportGroup = (group: AddressGroup) => {
    if (onImport) {
      if (selectedAddresses.size > 0) {
        // 只导入选中的地址
        onImport(group, Array.from(selectedAddresses));
      } else {
        // 导入全部地址
        onImport(group);
      }
    }
  };

  const handleImportSelected = () => {
    if (onImport) {
      const selectedGroupsList = groups.filter((g) =>
        selectedGroups.has(g._id)
      );
      selectedGroupsList.forEach((group) => onImport(group));
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    const confirmed = window.confirm("您确定要删除这个地址组吗？");
    if (confirmed && onDelete) {
      onDelete(groupId);
    }
  };

  return (
    <div className="space-y-4">
      {selectable && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedGroups.size === groups.length}
              onCheckedChange={handleSelectAllGroups}
            />
            <span className="text-black">全选</span>
          </div>
          {selectedGroups.size > 0 && (
            <Button onClick={handleImportSelected}>
              导入已选 ({selectedGroups.size})
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && <TableHead className="w-12"></TableHead>}
              <TableHead>名称</TableHead>
              <TableHead>地址数量</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <>
                <TableRow key={group._id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedGroups.has(group._id)}
                        onCheckedChange={() => handleSelectGroup(group._id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-black">
                    {group.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleExpandGroup(group._id)}
                    >
                      {Array.isArray(group.addresses)
                        ? group.addresses.length
                        : 0}{" "}
                      个地址
                    </Badge>
                  </TableCell>
                  <TableCell className="text-black">
                    {new Date(group.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-black">
                    {new Date(group.updatedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {onImport && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleImportGroup(group)}
                      >
                        导入
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => onEdit(group)}
                      >
                        编辑
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGroup(group._id)}
                      >
                        删除
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {expandedGroup === group._id && group.addresses && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="p-4 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox
                            checked={
                              selectedAddresses.size === group.addresses.length
                            }
                            onCheckedChange={() =>
                              handleSelectAllAddresses(
                                group.addresses?.map((addr) => addr.address) ||
                                  []
                              )
                            }
                          />
                          <span className="text-black">全选地址</span>
                        </div>
                        <div className="space-y-2">
                          {group.addresses.map((addr) => (
                            <div
                              key={addr.address}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={selectedAddresses.has(addr.address)}
                                onCheckedChange={() =>
                                  handleSelectAddress(addr.address)
                                }
                              />
                              <span className="font-mono text-black">
                                {addr.address}
                              </span>
                              {addr.description && (
                                <span className="text-black">
                                  ({addr.description})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
