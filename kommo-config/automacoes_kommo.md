# Automações Kommo - Dr. Igor

## AUTOMAÇÕES DE ENTRADA

### 1. NOVO LEAD CHEGOU
**Trigger:** Lead criado no Kommo
**Condições:**
- Status = "NOVO LEAD"
- Fonte preenchida

**Ações:**
1. Aguardar 2 minutos
2. Iniciar conversa com agente IA
3. Definir próximo follow-up para +24h (caso não responda)
4. Mover para "EM ATENDIMENTO IA"

### 2. LEAD SEM RESPOSTA INICIAL
**Trigger:** Lead há 24h em "EM ATENDIMENTO IA"
**Condições:**
- Sem interação nas últimas 24h
- numero_interacoes < 3

**Ações:**
1. Mover para "FOLLOW-UP 3 DIAS" (Funil 2)
2. Definir data follow-up para +3 dias
3. Tag: "sem_resposta_inicial"

## AUTOMAÇÕES DE QUALIFICAÇÃO

### 3. LEAD QUALIFICADO
**Trigger:** Tags aplicadas pelo IA
**Condições:**
- Tag "objetivo_claro" = Sim
- Tag "capacidade_financeira" = Positiva

**Ações:**
1. Mover para "QUALIFICADO"
2. Notificar equipe comercial (Telegram/WhatsApp)
3. Criar tarefa: "Contatar lead qualificado em 2h"
4. Calcular score_qualificacao

### 4. LEAD DESQUALIFICADO
**Trigger:** Tags aplicadas pelo IA
**Condições:**
- Tag "capacidade_financeira" = Negativa OU
- Tag "fora_perfil" = Sim

**Ações:**
1. Mover para "DESQUALIFICADO"
2. Verificar se tem "interesse_demonstrado"
3. Se SIM: Mover para "FOLLOW-UP 3 DIAS" (Funil 2)
4. Se NÃO: Arquivar lead

## AUTOMAÇÕES DE FOLLOW-UP

### 5. FOLLOW-UP 3 DIAS
**Trigger:** Data follow-up atingida
**Condições:**
- Status = "FOLLOW-UP 3 DIAS"
- Não respondeu nas últimas 72h

**Ações:**
1. Enviar mensagem reativação 3 dias (via IA)
2. Aguardar resposta por 24h
3. Se responder: Mover para "EM ATENDIMENTO IA" (Funil 1)
4. Se não responder: Mover para "FOLLOW-UP 7 DIAS"

### 6. FOLLOW-UP 7 DIAS
**Trigger:** Data follow-up atingida
**Condições:**
- Status = "FOLLOW-UP 7 DIAS"
- Não respondeu follow-up anterior

**Ações:**
1. Enviar mensagem reativação 7 dias (via IA)
2. Aguardar resposta por 48h
3. Se responder: Mover para "EM ATENDIMENTO IA" (Funil 1)
4. Se não responder: Mover para "FOLLOW-UP 15 DIAS"

### 7. FOLLOW-UP 15 DIAS (FINAL)
**Trigger:** Data follow-up atingida
**Condições:**
- Status = "FOLLOW-UP 15 DIAS"
- Última tentativa automática

**Ações:**
1. Enviar mensagem reativação final (via IA)
2. Aguardar resposta por 72h
3. Se responder: Mover para "EM ATENDIMENTO IA" (Funil 1)
4. Se não responder: Mover para "INATIVO"

## AUTOMAÇÕES DE ESCALAÇÃO

### 8. ESCALAÇÃO PARA HUMANO
**Trigger:** Tag "escalacao_humana" aplicada
**Condições:**
- Palavras-chave detectadas: "emergência", "reclamação", "urgente médico"
- OU solicitação específica do IA

**Ações:**
1. Mover para "ESCALADO PARA HUMANO" (Funil 3)
2. Notificar supervisor imediatamente
3. Pausar automações de IA
4. Criar tarefa urgente: "Atender lead escalado"

### 9. RESOLUÇÃO HUMANA
**Trigger:** Status alterado manualmente
**Condições:**
- Status mudou de "EM ATENDIMENTO HUMANO"

**Ações:**
1. Se para "RESOLVIDO - QUALIFICADO": Mover para "AGUARDANDO AGENDAMENTO" (Funil 1)
2. Se para "RESOLVIDO - DESQUALIFICADO": Mover para "FOLLOW-UP 3 DIAS" (Funil 2)
3. Reativar automações de IA se necessário

## AUTOMAÇÕES DE AGENDAMENTO

### 10. AGENDAMENTO CONFIRMADO
**Trigger:** Status = "AGENDADO"
**Condições:**
- Data consulta preenchida
- Horário confirmado

**Ações:**
1. Enviar confirmação por WhatsApp
2. Criar lembrete 24h antes da consulta
3. Criar lembrete 2h antes da consulta
4. Tag: "consulta_agendada"

### 11. LEMBRETE PRÉ-CONSULTA
**Trigger:** 24h antes da consulta
**Condições:**
- Status = "AGENDADO"
- Consulta em 24h

**Ações:**
1. Enviar mensagem de lembrete
2. Confirmar presença
3. Enviar localização (se presencial)
4. Enviar link (se online)

## AUTOMAÇÕES DE CONTROLE

### 12. ATUALIZAÇÃO DE SCORE
**Trigger:** Qualquer alteração em campos de qualificação
**Condições:**
- Campos alterados: objetivo_principal, capacidade_financeira, urgencia_expressa, etc.

**Ações:**
1. Recalcular score_qualificacao
2. Atualizar probabilidade_conversao
3. Se score melhorou significativamente: Notificar equipe

### 13. LEAD INATIVO LONGO PRAZO
**Trigger:** 30 dias sem interação
**Condições:**
- Status = "INATIVO"
- Última interação há 30+ dias

**Ações:**
1. Tag: "inativo_longo_prazo"
2. Mover para pipeline de campanhas especiais
3. Incluir em lista de remarketing

## NOTIFICAÇÕES PARA EQUIPE

### Telegram/WhatsApp da Equipe:
- **Imediato:** Lead qualificado, escalação humana
- **Diário (9h):** Resumo leads do dia anterior
- **Semanal (segunda 9h):** Relatório performance semanal

### Dashboard Interno:
- Leads qualificados aguardando contato
- Taxa de conversão por etapa
- Leads próximos de agendamento
- Follow-ups vencidos

## REGRAS DE PERFORMANCE

### SLA por Etapa:
- **QUALIFICADO → AGUARDANDO AGENDAMENTO:** 2 horas
- **ESCALADO PARA HUMANO:** 1 hora
- **AGUARDANDO AGENDAMENTO → AGENDADO:** 4 horas úteis

### Alertas de SLA:
- 50% do tempo: Alerta amarelo
- 80% do tempo: Alerta laranja
- 100% do tempo: Alerta vermelho + notificação supervisor