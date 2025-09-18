export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-900">
      <div className="max-w-xl w-full px-6 py-10 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4 text-center">I Teach You - Painel de Controle</h1>
        <p className="text-base leading-relaxed text-center">
          Bem-vindo ao painel administrativo base da plataforma <strong>I Teach You</strong>.
          Este projeto foi configurado com Next.js e React para servir como ponto de partida
          para futuras funcionalidades como gestão de matérias, turmas e geração de conteúdo
          com inteligência artificial.
        </p>
      </div>
    </main>
  );
}
