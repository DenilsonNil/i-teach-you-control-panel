import { SubjectManager } from "@/components/subjects/SubjectManager";

export default function SubjectsPage() {
  return (
    <main className="min-h-screen bg-slate-100 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Cadastro de matérias e aulas</h1>
          <p className="text-base text-slate-600">
            Configure as matérias disponíveis na plataforma e defina quais aulas
            estarão disponíveis para cada uma delas.
          </p>
        </header>
        <SubjectManager />
      </div>
    </main>
  );
}
