"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SubjectViewModel } from "@/types/subject";

type SubjectFormProps = {
  onSubjectSaved: (subject: SubjectViewModel, isNew: boolean) => void;
};

type FeedbackState = {
  type: "success" | "error";
  message: string;
};

const LESSON_PLACEHOLDER = "Ex.: Geometria básica";

export function SubjectForm({ onSubjectSaved }: SubjectFormProps) {
  const [subjectName, setSubjectName] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [lessons, setLessons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const normalizedLessons = useMemo(
    () => new Set(lessons.map((lesson) => lesson.trim().toLowerCase())),
    [lessons],
  );

  const normalizedPendingLesson = lessonName.trim().toLowerCase();

  const displayedLessons = useMemo(() => {
    const trimmedLesson = lessonName.trim();
    if (!trimmedLesson) {
      return lessons;
    }

    if (normalizedLessons.has(trimmedLesson.toLowerCase())) {
      return lessons;
    }

    return [...lessons, trimmedLesson];
  }, [lessonName, lessons, normalizedLessons]);

  const addLesson = useCallback(() => {
    const trimmed = lessonName.trim();
    const normalized = trimmed.toLowerCase();

    if (!trimmed || normalizedLessons.has(normalized)) {
      setLessonName("");
      return;
    }

    setLessons((previous) => [...previous, trimmed]);
    setLessonName("");
  }, [lessonName, normalizedLessons]);

  const removeLesson = useCallback(
    (lesson: string) => {
      const normalized = lesson.trim().toLowerCase();

      setLessons((previous) =>
        previous.filter((item) => item.trim().toLowerCase() !== normalized),
      );

      if (normalized === normalizedPendingLesson) {
        setLessonName("");
      }
    },
    [normalizedPendingLesson],
  );

  const resetForm = () => {
    setSubjectName("");
    setLessonName("");
    setLessons([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFeedback(null);

    const trimmedSubject = subjectName.trim();
    const trimmedLesson = lessonName.trim();

    const uniqueLessons = new Map<string, string>();
    lessons.forEach((lesson) => {
      const normalized = lesson.trim().toLowerCase();
      if (!uniqueLessons.has(normalized)) {
        uniqueLessons.set(normalized, lesson.trim());
      }
    });

    if (trimmedLesson) {
      const normalized = trimmedLesson.toLowerCase();
      if (!uniqueLessons.has(normalized)) {
        uniqueLessons.set(normalized, trimmedLesson);
      }
    }

    const payloadLessons = Array.from(uniqueLessons.values());

    if (!trimmedSubject || payloadLessons.length === 0) {
      setFeedback({
        type: "error",
        message: "Preencha o nome da matéria e adicione pelo menos uma aula.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedSubject,
          lessons: payloadLessons,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message ?? "Falha ao salvar a matéria.");
      }

      onSubjectSaved(payload.subject, payload.isNew);
      resetForm();
      setFeedback({
        type: "success",
        message: payload.isNew
          ? "Matéria criada com sucesso!"
          : "Matéria atualizada com as novas aulas.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível salvar a matéria.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Matéria"
        name="subject"
        placeholder="Ex.: Matemática"
        value={subjectName}
        onChange={(event) => setSubjectName(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <Input
            label="Adicionar aula"
            name="lesson"
            placeholder={LESSON_PLACEHOLDER}
            value={lessonName}
            onChange={(event) => setLessonName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addLesson();
              }
            }}
            disabled={isSubmitting}
          />
          
        </div>
        <div className="rounded-md border border-dashed border-slate-300 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Aulas selecionadas ({displayedLessons.length})
          </p>
          {displayedLessons.length === 0 ? (
            <p className="text-sm text-slate-500">
              Inclua as aulas que farão parte desta matéria.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayedLessons.map((lesson) => (
                <span
                  key={lesson}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {lesson}
                  <button
                    type="button"
                    onClick={() => removeLesson(lesson)}
                    className="text-xs font-semibold uppercase tracking-wider text-red-500 hover:text-red-600"
                    aria-label={`Remover aula ${lesson}`}
                  >
                    remover
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting ||
          !subjectName.trim() ||
          displayedLessons.length === 0
        }
      >
        {isSubmitting ? "Salvando..." : "Salvar matéria"}
      </Button>

      {feedback && (
        <p
          className={[
            "text-sm",
            feedback.type === "success" ? "text-green-600" : "text-red-600",
          ].join(" ")}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
