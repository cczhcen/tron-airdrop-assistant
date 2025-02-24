"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GroupFormProps {
  onSubmit: (name: string) => void;
}

export function GroupForm({ onSubmit }: GroupFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-black font-bold text-lg">
          分组名称
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入分组名称"
          className="text-black"
        />
      </div>
      <Button type="submit" className="mt-4">
        创建分组
      </Button>
    </form>
  );
}
