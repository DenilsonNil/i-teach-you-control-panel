"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { List } from "@/components/ui/List";
import type { SubjectViewModel } from "@/types/subject";

type SubjectListProps = {
  subjects: SubjectViewModel[];
  isLoading: boolean;
  onRetry: () => void;
};

export function SubjectList({ subjects, isLoading, onRetry }: SubjectListProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const hasSubjects = subjects.length > 0;

  const handleToggle = (subjectId: string) => {
    setExpandedSubjects((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId],
    );
  };

  const orderedSubjects = useMemo(
    () => [...subjects].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [subjects],
  );

  if (isLoading) {
    return (
      <Card title="Matérias cadastradas">
        <p className="text-sm text-slate-500">Carregando matérias...</p>
      </Card>
    );
  }

  if (!hasSubjects) {
    return (
      <Card title="Matérias cadastradas">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            Nenhuma matéria encontrada. Cadastre uma nova matéria ao lado.
          </p>
          <Button onClick={onRetry} variant="secondary" className="w-fit">
            Atualizar lista
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Matérias cadastradas">
      <div className="flex flex-col gap-3">
        {orderedSubjects.map((subject) => {
          const isExpanded = expandedSubjects.includes(subject.id);
          return (
            <div
              key={subject.id}
              className="rounded-md border border-slate-200 p-4 transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {subject.lessons.length} aula(s) cadastrada(s)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleToggle(subject.id)}
                  className="w-full sm:w-auto"
                >
                  {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                </Button>
              </div>
              {isExpanded && (
                <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Aulas cadastradas
                  </p>
                  <List items={subject.lessons.map((lesson) => lesson.title)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
