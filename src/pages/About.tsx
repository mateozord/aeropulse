import { Link } from "react-router-dom";

const STACK = ["React", "TypeScript", "Vite", "Tailwind CSS", "MapLibre GL", "Recharts"];

const SOURCES = [
  { name: "Open-Meteo", note: "Clima" },
  { name: "OpenSky Network", note: "Tráfego aéreo observado" },
  { name: "OpenFreeMap", note: "Tiles do mapa" },
  { name: "Google Gemini", note: "Explicação em linguagem natural" },
  { name: "Supabase", note: "Histórico de sinais" },
];

export function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Sobre</p>
      <h1 className="mt-4 text-4xl font-semibold text-foreground">AeroPulse</h1>
      <p className="mt-2 text-lg text-muted">Plataforma Experimental de Inteligência em Aviação</p>

      <h2 className="mt-10 text-lg font-semibold text-foreground">O problema</h2>
      <p className="mt-2 text-sm text-muted">
        Dados sobre condições relevantes para aviação existem em fontes e formatos diferentes — clima,
        tráfego observado, histórico — cada um isolado dos outros, difíceis de interpretar juntos sem
        conhecimento técnico do setor.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-foreground">A proposta</h2>
      <p className="mt-2 text-sm text-muted">
        O AeroPulse cruza esses sinais e os transforma em uma experiência visual simples: um score por
        aeroporto, sempre acompanhado dos fatores que o explicam — nunca um número sozinho, sem
        contexto.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-foreground">O projeto</h2>
      <p className="mt-2 text-sm text-muted">
        É um projeto pessoal, experimental e de portfólio — construído para explorar como transformar
        dados públicos em um sinal legível, com transparência sobre o que é real, o que é estimado e o
        que ainda não existe. Veja a{" "}
        <Link to="/methodology" className="text-accent hover:underline">
          Metodologia
        </Link>{" "}
        para o detalhamento completo.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-foreground">Stack</h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {STACK.map((tech) => (
          <li key={tech} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            {tech}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-lg font-semibold text-foreground">Fontes de dados</h2>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {SOURCES.map((s) => (
          <li key={s.name}>
            <span className="text-foreground">{s.name}</span> — {s.note}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-lg font-semibold text-foreground">Disclaimer</h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Projeto independente e não afiliado a aeroportos, companhias aéreas ou autoridades de aviação.
        O AeroPulse Score é um sinal experimental, não um indicador oficial — não prevê atrasos,
        cancelamentos ou operações reais.
      </p>
    </section>
  );
}
