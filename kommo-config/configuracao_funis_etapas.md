# Configuração de Funis e Etapas - Kommo

## FUNIL 1: ATENDIMENTO IA (Principal)
**Descrição:** Funil onde o agente IA conduz o primeiro atendimento e qualificação

### Etapas do Funil:
1. **NOVO LEAD**
   - Status inicial de todo lead que chega
   - Cor: Azul claro
   - Automação: Iniciar fluxo do agente IA após 2 minutos de inatividade

2. **EM ATENDIMENTO IA**
   - Lead está sendo atendido pelo agente IA
   - Cor: Amarelo
   - Movimentação: Automática quando IA inicia conversa

3. **QUALIFICADO**
   - Lead atende aos 2 critérios obrigatórios (objetivo + capacidade financeira)
   - Cor: Verde claro
   - Ação: Notificar equipe humana para contato

4. **AGUARDANDO AGENDAMENTO**
   - Lead qualificado aguardando confirmação de horário
   - Cor: Laranja
   - SLA: 2 horas para resposta humana

5. **AGENDADO**
   - Consulta confirmada e agendada
   - Cor: Verde escuro
   - Meta principal do funil

6. **DESQUALIFICADO**
   - Lead não atende critérios de qualificação
   - Cor: Vermelho
   - Ação: Mover para funil de follow-up ou arquivar

## FUNIL 2: FOLLOW-UP E NUTRIÇÃO
**Descrição:** Para leads que demonstraram interesse mas precisam de tempo/trabalho

### Etapas do Funil:
1. **FOLLOW-UP 3 DIAS**
   - Leads que precisam "pensar" ou consultar família
   - Automação: Mensagem em 3 dias

2. **FOLLOW-UP 7 DIAS**
   - Segunda tentativa de reativação
   - Automação: Mensagem em 7 dias

3. **FOLLOW-UP 15 DIAS**
   - Última tentativa automática
   - Automação: Mensagem em 15 dias

4. **REATIVADO**
   - Lead respondeu positivamente ao follow-up
   - Ação: Retornar para "EM ATENDIMENTO IA" no Funil 1

5. **INATIVO**
   - Não respondeu aos follow-ups
   - Ação: Arquivar ou manter para campanha longa

## FUNIL 3: ATENDIMENTO HUMANO
**Descrição:** Para casos que necessitam intervenção humana especializada

### Etapas do Funil:
1. **ESCALADO PARA HUMANO**
   - Transferência do agente IA
   - Motivos: Urgência médica, reclamação, dúvida específica

2. **EM ATENDIMENTO HUMANO**
   - Atendente/especialista assumiu o caso
   - SLA: 1 hora para primeiro contato

3. **RESOLVIDO - QUALIFICADO**
   - Problema resolvido, lead qualificado
   - Ação: Retornar para "AGUARDANDO AGENDAMENTO" no Funil 1

4. **RESOLVIDO - DESQUALIFICADO**
   - Problema resolvido, lead não qualificado
   - Ação: Arquivar ou mover para follow-up

## AUTOMAÇÕES DE MOVIMENTAÇÃO

### Do Funil 1 para Funil 2:
- Lead em "DESQUALIFICADO" mas com tag "interesse_demonstrado" → FOLLOW-UP 3 DIAS
- Lead em "EM ATENDIMENTO IA" sem resposta por 24h → FOLLOW-UP 3 DIAS

### Do Funil 1 para Funil 3:
- Tag "escalacao_humana" aplicada → ESCALADO PARA HUMANO
- Palavras-chave: "emergência", "reclamação", "urgente" → ESCALADO PARA HUMANO

### Do Funil 2 de volta para Funil 1:
- Resposta positiva em qualquer etapa de follow-up → EM ATENDIMENTO IA

## RESPONSÁVEIS POR ETAPA

### Funil 1 - Atendimento IA:
- NOVO LEAD: Sistema automático
- EM ATENDIMENTO IA: Agente IA
- QUALIFICADO: Equipe comercial
- AGUARDANDO AGENDAMENTO: Recepção
- AGENDADO: Recepção
- DESQUALIFICADO: Sistema automático

### Funil 2 - Follow-up:
- Todas as etapas: Sistema automático + supervisão humana

### Funil 3 - Atendimento Humano:
- Todas as etapas: Supervisor de atendimento

## MÉTRICAS DE ACOMPANHAMENTO

### Por Funil:
- Taxa de conversão entre etapas
- Tempo médio em cada etapa
- Volume de leads por funil
- Taxa de qualificação final

### Específicas:
- **Funil 1:** % leads que chegam em "AGENDADO"
- **Funil 2:** % reativação por follow-up
- **Funil 3:** % resolução com qualificação