"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";

const EditProfileDialog = () => {
  const { currentUser } = useAuth();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    userName: currentUser?.userName || "",
    email: currentUser?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = async () => {
    try {
      // 👉 API call (future)
      // await fetch("/api/profile", { method:"PATCH", body: JSON.stringify(form) })

      // TEMP: update local auth state
      // setCurrentUser?.((prev: any) => ({
      //   ...prev,
      //   userName: form.userName,
      //   email: form.email,
      // }));

      setOpen(false);
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleEdit}>Update Profile</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
