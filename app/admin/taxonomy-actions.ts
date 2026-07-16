"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "lib/auth";
import { prisma } from "lib/prisma";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createCategory(form: FormData) {
  await requireAdmin();
  const br = String(form.get("br") ?? "").trim();
  const en = String(form.get("en") ?? "").trim();
  if (!br || !en) throw new Error("Both translations are required.");
  await prisma.category.create({
    data: {
      translations: {
        create: [
          { locale: "PT_BR", name: br, slug: slugify(br) },
          { locale: "EN_US", name: en, slug: slugify(en) },
        ],
      },
    },
  });
  revalidatePath("/br/blog/categories");
  revalidatePath("/en/blog/categories");
}
export async function createTag(form: FormData) {
  await requireAdmin();
  const br = String(form.get("br") ?? "").trim();
  const en = String(form.get("en") ?? "").trim();
  if (!br || !en) throw new Error("Both translations are required.");
  await prisma.tag.create({
    data: {
      translations: {
        create: [
          { locale: "PT_BR", name: br, slug: slugify(br) },
          { locale: "EN_US", name: en, slug: slugify(en) },
        ],
      },
    },
  });
}

export async function deleteCategory(categoryId: string, form: FormData) {
  void form;
  await requireAdmin();
  await prisma.category.deleteMany({ where: { id: categoryId } });
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/br/blog");
  revalidatePath("/en/blog");
  revalidatePath("/br/blog/categories");
  revalidatePath("/en/blog/categories");
}

export async function deleteTag(tagId: string, form: FormData) {
  void form;
  await requireAdmin();
  await prisma.tag.deleteMany({ where: { id: tagId } });
  revalidatePath("/admin");
  revalidatePath("/admin/tags");
  revalidatePath("/br/blog");
  revalidatePath("/en/blog");
}
