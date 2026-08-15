function Factor({ title, points, description }: { title: string; points: string; description: string }) {
  return (
    <div className="border-t border-border py-6">
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted">{points}</p>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
    </div>
  );
}

export function Methodology() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Como funciona</p>
      <h1 className="mt-4 text-4xl font-semibold text-foreground">Score AeroPulse</h1>
      <p className="mt-4 text-muted">
        O Score AeroPulse é um sinal experimental de 0 a 100 calculado por este app a partir das
        condições climáticas. Não é um indicador oficial de aviação, e não prevê atrasos,
        cancelamentos ou operações reais de companhias aéreas. Encare como um ponto de partida para
        curiosidade, não como uma fonte de verdade.
      </p>

      <div className="mt-10 rounded-lg border border-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wider text-muted">Faixas de status</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><p className="text-normal font-semibold">NORMAL</p><p className="text-xs text-muted">0–29</p></div>
          <div><p className="text-attention font-semibold">ATENÇÃO</p><p className="text-xs text-muted">30–49</p></div>
          <div><p className="text-elevated font-semibold">ELEVADO</p><p className="text-xs text-muted">50–69</p></div>
          <div><p className="text-high font-semibold">ALTO</p><p className="text-xs text-muted">70–100</p></div>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground">O que compõe o score (v1)</h2>
      <p className="mt-2 text-sm text-muted">
        A versão 1 usa só o clima. Cada fator contribui com pontos até um limite próprio, então
        nenhum fator sozinho domina o score — e o app sempre lista quais fatores realmente entraram
        em ação como "principais fatores".
      </p>

      <div>
        <Factor
          title="Chance de chuva"
          points="até 40 pts"
          description="Escala diretamente com a probabilidade de chuva informada para a hora atual (Open-Meteo). 100% de chance contribui com os 40 pontos completos."
        />
        <Factor
          title="Velocidade do vento"
          points="até 35 pts"
          description="Nenhuma contribuição abaixo de 20 km/h. Acima disso, os pontos escalam com a velocidade e chegam ao limite de 35 quando o vento atinge cerca de 40 km/h."
        />
        <Factor
          title="Visibilidade"
          points="0 / 15 / 35 pts"
          description="Visibilidade boa não contribui nada, Moderada soma 15 pontos, Ruim soma 35."
        />
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground">O que ficou de fora de propósito</h2>
      <p className="mt-2 text-sm text-muted">
        O tráfego aéreo observado (via OpenSky) aparece em todo painel de aeroporto como dado real,
        ao vivo — mas ainda não faz parte do score. Um número bruto de aeronaves não significa nada
        sem saber o que é normal para aquele aeroporto específico: Guarulhos é movimentado numa
        terça-feira comum de um jeito que Santos Dumont nunca é. Incluir o tráfego no score exige uma
        base histórica por aeroporto, que o AeroPulse ainda não tem (isso é uma fase futura). A
        tendência (subindo/caindo/estável) ainda é ilustrativa/simulada pelo mesmo motivo — precisa
        de histórico para ser real.
      </p>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Fontes de dados</h2>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        <li>Clima — <span className="text-foreground">Open-Meteo</span> (dados abertos, CC-BY 4.0)</li>
        <li>Tráfego aéreo — <span className="text-foreground">OpenSky Network</span> (dados abertos, acesso anônimo)</li>
        <li>Mapa — <span className="text-foreground">OpenFreeMap</span> / colaboradores do OpenStreetMap</li>
      </ul>
    </section>
  );
}
