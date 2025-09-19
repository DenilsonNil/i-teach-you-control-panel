"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SubjectViewModel } from "@/types/subject";
import { SubjectForm } from "./SubjectForm";
import { SubjectList } from "./SubjectList";

type FetchState = {
  subjects: SubjectViewModel[];
  isLoading: boolean;
  error?: string;
};

const initialState: FetchState = {
  subjects: [],
  isLoading: true,
  error: undefined,
};

export function SubjectManager() {
  const [state, setState] = useState<FetchState>(initialState);

  const loadSubjects = useCallback(async () => {
    try {
      setState((previous) => ({ ...previous, isLoading: true, error: undefined }));
      const response = await fetch("/api/subjects", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message ?? "Não foi possível carregar as matérias.");
      }

      setState({ subjects: payload.subjects ?? [], isLoading: false, error: undefined });
    } catch (error) {
      setState({
        subjects: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao buscar as matérias.",
      });
    }
  }, []);

  useEffect(() => {
    void loadSubjects();
  }, [loadSubjects]);

  const handleSubjectSaved = useCallback(
    (subject: SubjectViewModel, isNew: boolean) => {
      setState((previous) => {
        const subjects = isNew
          ? [subject, ...previous.subjects]
          : previous.subjects.map((item) =>
              item.id === subject.id ? { ...subject } : item,
            );

        return {
          ...previous,
          subjects,
          isLoading: false,
          error: undefined,
        };
      });
    },
    [],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <Card
        title="Cadastrar matéria e aulas"
        description="Informe o nome da matéria e liste as aulas associadas que serão habilitadas na plataforma."
      >
        <SubjectForm onSubjectSaved={handleSubjectSaved} />
      </Card>

      {state.error ? (
        <Card title="Matérias cadastradas">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-red-600">{state.error}</p>
            <Button
              onClick={() => {
                void loadSubjects();
              }}
              variant="secondary"
              className="w-fit"
            >
              Tentar novamente
            </Button>
          </div>
        </Card>
      ) : (
        <SubjectList
          subjects={state.subjects}
          isLoading={state.isLoading}
          onRetry={() => {
            void loadSubjects();
          }}
        />
      )}
    </div>
  );
}
