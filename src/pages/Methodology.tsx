function Factor({
  title,
  maxPoints,
  description,
}: {
  title: string;
  maxPoints: number;
  description: string;
}) {
  return (
    <div className="border-t border-border py-6">
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted">até {maxPoints} pts</p>
      </div>
      <div className="mt-3 h-1.5 w-full max-w-2xl overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-accent-dim" style={{ width: `${maxPoints}%` }} />
      </div>
      <p className="mt-3 max-w-2xl text-sm text-muted">{description}</p>
    </div>
  );
}

export function Methodology() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Como funciona</p>
      <h1 className="mt-4 text-4xl font-semibold text-foreground">Score AeroPulse</h1>
      <p className="mt-4 text-muted">
        O Score AeroPulse é um sinal experimental de 0 a 100 calculado por este app. Em v1, ele é
        baseado principalmente num <strong className="text-foreground">Weather Signal</strong>{" "}
        experimental — as condições climáticas do momento. Não é uma avaliação completa da operação de
        um aeroporto, e não deve ser lido como tal.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-foreground">O que o AeroPulse é</h2>
      <p className="mt-2 text-sm text-muted">
        Um jeito de cruzar sinais públicos sobre um aeroporto — hoje, principalmente clima — num único
        número explicável, sempre acompanhado dos fatores específicos que o produziram.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">O que o AeroPulse não é</h2>
      <ul className="mt-2 space-y-1.5 text-sm text-muted">
        <li>Não é uma ferramenta oficial de aviação.</li>
        <li>Não prevê atrasos de voos.</li>
        <li>Não prevê cancelamentos.</li>
        <li>Não substitui fontes oficiais (companhias aéreas, operadores de aeroporto, ANAC).</li>
        <li>Não avalia a operação do aeroporto como um todo — hoje, é essencialmente um sinal de clima.</li>
      </ul>

      <div className="mt-10 rounded-lg border border-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wider text-muted">Faixas de status</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><p className="text-normal font-semibold">NORMAL</p><p className="text-xs text-muted">0–29</p></div>
          <div><p className="text-attention font-semibold">ATENÇÃO</p><p className="text-xs text-muted">30–49</p></div>
          <div><p className="text-elevated font-semibold">ELEVADO</p><p className="text-xs text-muted">50–69</p></div>
          <div><p className="text-high font-semibold">ALTO</p><p className="text-xs text-muted">70–100</p></div>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground">O que compõe o Weather Signal (v1)</h2>
      <p className="mt-2 text-sm text-muted">
        Hoje o score inteiro vem do clima. Cada fator contribui com pontos até um limite próprio, então
        nenhum fator sozinho domina o resultado — e o app sempre lista quais fatores realmente entraram
        em ação como "principais fatores".
      </p>

      <div>
        <Factor
          title="Chance de chuva"
          maxPoints={40}
          description="Escala diretamente com a probabilidade de chuva informada para a hora atual (Open-Meteo). 100% de chance contribui com os 40 pontos completos."
        />
        <Factor
          title="Velocidade do vento"
          maxPoints={35}
          description="Nenhuma contribuição abaixo de 20 km/h. Acima disso, os pontos escalam com a velocidade e chegam ao limite de 35 quando o vento atinge cerca de 40 km/h."
        />
        <Factor
          title="Visibilidade"
          maxPoints={35}
          description="Visibilidade boa não contribui nada, Moderada soma 15 pontos, Ruim soma 35 (0 / 15 / 35 pts)."
        />
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Sinais ainda não incluídos</h2>
      <p className="mt-2 text-sm text-muted">
        O painel de cada aeroporto também mostra um <strong className="text-foreground">Air Traffic
        Signal</strong> (aeronaves observadas via OpenSky) e reserva espaço para um futuro{" "}
        <strong className="text-foreground">Event Signal</strong> — mas nenhum dos dois entra no
        cálculo do score hoje. Quando não há leitura de tráfego disponível para um aeroporto, o app
        mostra "N/D": nunca inventa um valor, e nunca trata ausência de dado como zero aeronaves. Um
        número bruto de aeronaves também não significa nada sem saber o que é normal para aquele
        aeroporto: Guarulhos é movimentado numa terça-feira comum de um jeito que Santos Dumont nunca
        é. Incluir tráfego no score exige uma base histórica por aeroporto que o AeroPulse ainda não
        tem — por ora, prefiro mostrar o dado real e deixá-lo de fora do cálculo a fingir uma fórmula
        que meça algo que ainda não sei medir direito.
      </p>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Histórico e tendência</h2>
      <p className="mt-2 text-sm text-muted">
        O gráfico de tendência mostra as últimas 24h de score real quando existem pelo menos dois
        pontos capturados. Esses pontos vêm de uma rotina agendada (GitHub Actions) que roda a cada 30
        minutos, calcula o score de cada aeroporto e grava uma linha numa tabela Postgres (Supabase) —
        eles persistem indefinidamente ali, independente de você atualizar a página ou de um novo
        deploy do site (o deploy só troca o código, nunca apaga o histórico já gravado). Para um
        aeroporto sem histórico suficiente ainda, o gráfico mostra um exemplo ilustrativo no lugar,
        claramente identificado como não sendo dado real — nunca uma tendência real disfarçada.
      </p>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Fontes de dados</h2>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        <li>Clima — <span className="text-foreground">Open-Meteo</span> (dados abertos, CC-BY 4.0)</li>
        <li>Tráfego aéreo — <span className="text-foreground">OpenSky Network</span> (dados abertos, acesso anônimo)</li>
        <li>Mapa — <span className="text-foreground">OpenFreeMap</span> / colaboradores do OpenStreetMap</li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold text-foreground">Limitações</h2>
      <ul className="mt-2 space-y-1.5 text-sm text-muted">
        <li>O AeroPulse não é uma ferramenta oficial de aviação.</li>
        <li>Não prevê atrasos de voos.</li>
        <li>Não prevê cancelamentos.</li>
        <li>Não substitui fontes oficiais de companhias aéreas, aeroportos ou autoridades de aviação.</li>
        <li>A cobertura de cada fonte de dados pode variar — nem todo aeroporto tem leitura disponível o tempo todo.</li>
        <li>O score é experimental: uma heurística construída para este projeto, não um modelo validado.</li>
      </ul>
    </section>
  );
}
