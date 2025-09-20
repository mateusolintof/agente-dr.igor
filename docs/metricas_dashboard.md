# Métricas e Dashboard - Dr. Igor

## KPIs Principais

### 1. Conversão
- **Taxa de Conversão Geral**: Leads → Pacientes
  - Meta: 8% a 10% (vs. 2,5% atual)
  - Cálculo: (Pacientes Novos / Total Leads) × 100

- **Taxa de Leads com Dados Completos**: Leads → Triagem concluída
  - Meta: 40-50%
  - Cálculo: (Leads que chegaram aos status "Triagem" ou "Consultando Disponibilidade" / Total Leads) × 100

- **Taxa de Agendamento**: Leads que receberam opções → Agendados
  - Meta: 60-70%
  - Cálculo: (Consultas Agendadas / Leads com opções enviadas) × 100

-  **Distribuição_Esperada**:
  - Leads_qualificados: "25-30%"
  - Leads_em_nutricao: "40-45%"
  - Leads_nao_qualificados: "25-35%"

-   **KPIs_Esperados**:
  - taxa_qualificacao_correta: "85-90%"
  - reducao_tempo_vendedor: "60%"
  - satisfacao_lead_qualificado: "9/10"
  - conversao_qualified_to_sale: "40-50%"

-   **Vantagens_do_Sistema**:
    - Transparência: "Critérios claros e auditáveis"
    - Flexibilidade: "Fácil ajuste de regras"
    - Compreensão: "Equipe entende facilmente"
    - Precisão: "Menos falsos positivos"

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

-- Query: Análise de Qualificação
CREATE VIEW lead_qualification_metrics AS
SELECT 
  -- Total de leads por status
  COUNT(*) as total_leads,
  COUNT(CASE WHEN qualification_status = 'qualified' THEN 1 END) as qualified_leads,
  COUNT(CASE WHEN qualification_status = 'nurturing' THEN 1 END) as nurturing_leads,
  COUNT(CASE WHEN qualification_status = 'not_qualified' THEN 1 END) as not_qualified_leads,
  
  -- Taxa de qualificação
  ROUND(
    COUNT(CASE WHEN qualification_status = 'qualified' THEN 1 END) * 100.0 / 
    NULLIF(COUNT(*), 0), 2
  ) as qualification_rate,
  
  -- Análise por critério
  AVG(CASE WHEN has_complete_info THEN 1 ELSE 0 END) * 100 as pct_with_complete_info,
  AVG(CASE WHEN has_specific_problem THEN 1 ELSE 0 END) * 100 as pct_with_problem,
  AVG(CASE WHEN has_urgency THEN 1 ELSE 0 END) * 100 as pct_with_urgency,
  AVG(CASE WHEN accepts_private_pay THEN 1 ELSE 0 END) * 100 as pct_accepts_private,
  
  -- Análise por modalidade
  COUNT(CASE WHEN attendance_mode = 'online' THEN 1 END) as online_leads,
  COUNT(CASE WHEN attendance_mode = 'presential' THEN 1 END) as presential_leads,
  
  -- Performance de conversão
  COUNT(CASE WHEN qualification_status = 'qualified' AND converted = true THEN 1 END) as qualified_converted,
  ROUND(
    COUNT(CASE WHEN qualification_status = 'qualified' AND converted = true THEN 1 END) * 100.0 /
    NULLIF(COUNT(CASE WHEN qualification_status = 'qualified' THEN 1 END), 0), 2
  ) as qualified_conversion_rate

FROM leads
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

-- Query: Motivos de Não Qualificação
CREATE VIEW disqualification_reasons AS
SELECT 
  disqualification_reason,
  COUNT(*) as total_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM leads
WHERE qualification_status = 'not_qualified'
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY disqualification_reason
ORDER BY total_count DESC;

## Dashboard em Tempo Real

### Visão Executiva