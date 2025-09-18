# Métricas e Dashboard - Dr. Igor

## KPIs Principais

### 1. Conversão
- **Taxa de Conversão Geral**: Leads → Pacientes
  - Meta: 15-20% (vs. 2,5% atual)
  - Cálculo: (Pacientes Novos / Total Leads) × 100

- **Taxa de Leads com Dados Completos**: Leads → Triagem concluída
  - Meta: 40-50%
  - Cálculo: (Leads que chegaram aos status "Triagem" ou "Consultando Disponibilidade" / Total Leads) × 100

- **Taxa de Agendamento**: Leads que receberam opções → Agendados
  - Meta: 60-70%
  - Cálculo: (Consultas Agendadas / Leads com opções enviadas) × 100

### 2. Performance do Bot
- **Tempo de Resposta**
  - Meta: < 30 s
  - Cálculo: Tempo médio entre mensagem do paciente e resposta da IA.

- **Tempo até Envio de Opções**
  - Meta: < 5 min após pedido de agenda.
  - Cálculo: (Horário da primeira opção oferecida – Horário em que o paciente pediu agenda).

- **Taxa de Transferência Humana**
  - Meta: 25-35%
  - Cálculo: (Leads movidos para "Handoff Humano" / Total interações) × 100.

### 3. Follow-up
- **Taxa de Resposta Follow-up**
  - 24h: Meta 15-20%
  - 48h: Meta 10-15%
  - 7d: Meta 5-10%

- **Conversão Pós Follow-up**
  - Meta: 8-12%
  - Cálculo: (Agendados após follow-up / Total follow-ups enviados) × 100.

### 4. Operacionais
- **Volume de Leads**: acompanhamento diário, semanal e mensal.
- **Uptime do Sistema**: meta > 99% (Kommo, n8n, MEDX, OpenAI).
- **Fila de Tarefas Humanas**: número de leads aguardando confirmação manual.

## Dashboard em Tempo Real

### Visão Executiva

┌─────────────────────────────────────────────────────────────┐
│                    INSTITUTO AGUIAR NERI                   │
│                   Dashboard Dr. Igor - Hoje                │
├─────────────────────────────────────────────────────────────┤
│ Leads Hoje: 24     │ Triagem Concluída: 11 (46%)          │
│ Opções Enviadas: 8 │ Agendamentos: 6                      │
│ Tempo Médio Opções: 4m32s                                  │
└─────────────────────────────────────────────────────────────┘

### Configuração de Alertas
```javascript
const alertas = {
  bot_offline: {
    condicao: 'webhook_failures > 3',
    acao: 'notificar_telegram',
    urgencia: 'alta'
  },
  baixa_conversao: {
    condicao: 'taxa_conversao_diaria < 10%',
    acao: 'email_supervisor',
    urgencia: 'media'
  },
  atraso_agenda: {
    condicao: 'tempo_medio_opcoes > 10',
    acao: 'alertar_time_bot',
    urgencia: 'alta'
  },
  followup_excedido: {
    condicao: 'tentativas_followup >= 3',
    acao: 'abrir_task_humana',
    urgencia: 'media'
  }
};
```

## Relatórios Analíticos
- **Intenções mais comuns**: interesse em emagrecimento, saúde hormonal, performance.
- **Preferências de Agenda**: dias e turnos mais solicitados, comparação presença x on-line.
- **Objeções recorrentes**: preço, tempo, medicações; cruzar com taxa de conversão após resposta RAQ.
- **Efetividade Follow-up**: % de respostas por tentativa, tempo médio até retorno.
- **Tempo de Handoff**: intervalo entre escolha do paciente e confirmação humana.

## Infraestrutura de Dados

### 1. Arquitetura
- Coleta via n8n (webhooks) → Data Lake (S3/GCS) → Data Warehouse (BigQuery/Snowflake/PostgreSQL).
- ETL diário consolida métricas para dashboard BI (Looker Studio, Power BI ou Metabase).

### 2. Esquema de Tabelas (SQL)
```sql
-- Tabela principal de métricas diárias
CREATE TABLE metricas_diarias (
    data DATE PRIMARY KEY,
    total_leads INT,
    leads_triagem INT,
    opcoes_enviadas INT,
    agendamentos INT,
    tempo_medio_opcoes INTERVAL,
    followups_enviados INT,
    followups_com_resposta INT,
    taxa_conversao DECIMAL(5,2)
);

-- Tabela de interações detalhadas
CREATE TABLE interacoes (
    id UUID PRIMARY KEY,
    lead_id VARCHAR(50),
    timestamp TIMESTAMP,
    tipo ENUM('mensagem', 'resposta_bot', 'task_humana'),
    intent VARCHAR(50),
    status_pipeline VARCHAR(50),
    canal VARCHAR(20)
);

-- Tabela de follow-up
CREATE TABLE followups (
    id UUID PRIMARY KEY,
    lead_id VARCHAR(50),
    tentativa SMALLINT,
    enviado_em TIMESTAMP,
    resposta BOOLEAN,
    respondeu_em TIMESTAMP,
    proxima_acao VARCHAR(50)
);
```

### 3. API de Métricas (FastAPI exemplo)
```python
from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

@app.get('/api/metricas/hoje')
def metricas_hoje():
    hoje = datetime.now().date()
    return {
        "data": str(hoje),
        "leads_total": get_leads_count(hoje),
        "triagem_concluida": get_triage_count(hoje),
        "opcoes_enviadas": get_options_count(hoje),
        "agendamentos": get_scheduled_count(hoje),
        "tempo_medio_opcoes": get_average_option_time(hoje)
    }
```

### 4. Frontend Dashboard (Vue/React pseudo-código)
```javascript
const Dashboard = {
  data() {
    return {
      metricas: {},
      leads: [],
      intervalo: null
    };
  },
  mounted() {
    this.carregarDados();
    this.intervalo = setInterval(this.carregarDados, 30000);
  },
  beforeUnmount() {
    clearInterval(this.intervalo);
  },
  methods: {
    async carregarDados() {
      const metricas = await fetch('/api/metricas/hoje').then(r => r.json());
      const leads = await fetch('/api/leads/ativos').then(r => r.json());
      this.metricas = metricas;
      this.leads = leads;
    }
  }
};
```

### 5. Alertas Automatizados (n8n)
```javascript
{
  "trigger": "cron_diario",
  "checks": [
    { "cond": "tempo_medio_opcoes > 600", "acao": "notify_slack" },
    { "cond": "followups_sem_resposta > 20", "acao": "abrir_task" },
    { "cond": "erros_medx > 3", "acao": "notify_oncall" }
  ]
}
```

## Otimização Contínua

### A/B Testing
- Testar variações de prompts de follow-up (tom, CTA, prova social).
- Avaliar horários de envio (manhã vs. tarde).
- Comparar apresentações de opções (texto corrido vs. lista numerada).

### Feedback Loop
- Revisão mensal de conversas perdidas com a equipe humana.
- Atualização da RAQ com novas objeções coletadas.
- Ajuste das metas de tempo médio conforme volume de leads.
