"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/providers/auth-provider";
import { useUpdateProfile } from "@/lib/api/client/users";
import { editProfileSchema, type EditProfileFormValues } from "@/lib/validation";
import type { User } from "@/lib/api/types";

const EditProfileDialog = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
    },
  });

  // Keep form values in sync if currentUser changes externally
  useEffect(() => {
    if (currentUser) {
      reset({ name: currentUser.name, email: currentUser.email });
    }
  }, [currentUser, reset]);

  const { mutateAsync: updateProfile } = useUpdateProfile(
    currentUser?.id ?? 0,
    (updated: User) => {
      updateCurrentUser(updated);
      toast.success("Profile updated!", {
        description: `Saved as ${updated.name}`,
      });
      setOpen(false);
    },
  );

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      await updateProfile({ name: values.name, email: values.email });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      toast.error("Could not update profile", { description: msg });
    }
  };

  if (!currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
