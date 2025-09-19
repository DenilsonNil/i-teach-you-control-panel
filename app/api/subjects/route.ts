import { NextResponse } from "next/server";
import {
  appendLessonsToSubject,
  createSubject,
  findAllSubjects,
  findSubjectByName,
} from "@/lib/repositories/subjectRepository";
import type { CreateSubjectPayload } from "@/types/subject";

type ValidatedPayload = {
  name: string;
  lessons: string[];
};

const normalizeLessons = (lessons: unknown): string[] => {
  if (!Array.isArray(lessons)) {
    return [];
  }

  const unique = new Map<string, string>();

  lessons.forEach((lesson) => {
    if (typeof lesson !== "string") {
      return;
    }

    const trimmed = lesson.trim();
    if (!trimmed) {
      return;
    }

    const key = trimmed.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, trimmed);
    }
  });

  return Array.from(unique.values());
};

const validatePayload = (payload: CreateSubjectPayload): ValidatedPayload | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const { name, lessons } = payload;

  if (typeof name !== "string" || !name.trim()) {
    return null;
  }

  const normalizedLessons = normalizeLessons(lessons);
  if (normalizedLessons.length === 0) {
    return null;
  }

  return {
    name: name.trim(),
    lessons: normalizedLessons,
  };
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subjects = await findAllSubjects();
    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Failed to fetch subjects", error);
    return NextResponse.json(
      { message: "Falha ao buscar as matérias." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSubjectPayload;
    const payload = validatePayload(body);

    if (!payload) {
      return NextResponse.json(
        { message: "Informe o nome da matéria e ao menos uma aula válida." },
        { status: 400 },
      );
    }

    const { name, lessons } = payload;

    const existing = await findSubjectByName(name);

    if (!existing) {
      const created = await createSubject(name, lessons);
      return NextResponse.json(
        { subject: created, isNew: true },
        { status: 201 },
      );
    }

    const updated = await appendLessonsToSubject(existing.id, lessons);

    return NextResponse.json({ subject: updated, isNew: false });
  } catch (error) {
    console.error("Failed to process subject generation", error);
    return NextResponse.json(
      { message: "Erro ao salvar a matéria." },
      { status: 500 },
    );
  }
}
