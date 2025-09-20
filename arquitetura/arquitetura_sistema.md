# Arquitetura Completa do Sistema Dr. Igor

## VISÃO GERAL DO SISTEMA

### Objetivo Principal
Sistema de automação de atendimento para consultório de nutrologia, focado na conversão de leads através de agente IA especializado em vendas consultivas, com foco na realidade estética (80% dos casos).

### Principais Componentes
1. **Agente IA de Atendimento** (Alice)
2. **Sistema de Qualificação Inteligente**
3. **Funis de Automação no Kommo**
4. **Sistema de Follow-up Automatizado**
5. **Integração com MedX (agendamento)**
6. **Dashboard de Métricas e Performance**

## ARQUITETURA TÉCNICA

### Stack Tecnológico
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │    │   Instagram     │    │   Facebook      │
│   Business      │    │   Business      │    │   Messenger     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └─────────────┬────────────────┬──────────────┘
                        │                │
                 ┌─────────────────────────────────┐
                 │          N8N WORKFLOW          │
                 │      (Orquestrador Central)     │
                 └─────────────┬───────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼───────┐   ┌───────▼────────┐   ┌──────▼───────┐
│  AGENTE IA      │   │     KOMMO      │   │    MedX      │
│   (Alice)       │   │   (CRM/Funis)  │   │ (Agendamento)│
│  - OpenAI API   │   │ - Lead Mgmt    │   │ - Calendário │
│  - Prompts      │   │ - Automações   │   │ - Validação  │
│  - Condicionais │   │ - Tags/Campos  │   │ - Notif.     │
└─────────────────┘   └────────────────┘   └──────────────┘
```

### Fluxo de Dados
```
Lead Entrada → N8N → Kommo (Novo Lead) → Agente IA → Qualificação →
┌─ Qualificado → Equipe Humana → MedX → Agendamento
├─ Desqualificado → Follow-up (3/7/15 dias)
└─ Escalação → Atendimento Humano Imediato
```

## COMPONENTES DETALHADOS

### 1. AGENTE IA (ALICE)

**Tecnologia:** OpenAI GPT-4 + Prompts Especializados
**Função:** Vendedora consultiva virtual

**Características:**
- Sistema adaptativo baseado em condicionais
- Personalização em tempo real
- Integração com Kommo para dados/tags
- Scripts dinâmicos por perfil de lead

**Inputs:**
- Mensagem do lead
- Histórico da conversa
- Dados do Kommo (tags, campos)
- Condicionais ativadas

**Outputs:**
- Resposta personalizada
- Tags para aplicar no Kommo
- Decisão de qualificação
- Próxima ação (follow-up/transferência)

### 2. SISTEMA DE QUALIFICAÇÃO

**Critérios Simplificados:**
- Objetivo claro (obrigatório)
- Capacidade financeira (obrigatório)

**Refinadores:**
- Urgência expressa
- Tentativas anteriores
- Interesse no método
- Disponibilidade agenda
- Busca medicação

**Processo:**
```
Lead → Descoberta → Avaliação → Qualificação → Ação
   └─ Objetivo?    └─ Pagamento?    └─ Tags    └─ Funil
```

### 3. FUNIS NO KOMMO

#### FUNIL 1: ATENDIMENTO IA
```
NOVO LEAD → EM ATENDIMENTO IA → QUALIFICADO →
AGUARDANDO AGENDAMENTO → AGENDADO → REALIZADO
                    └─ DESQUALIFICADO
```

#### FUNIL 2: FOLLOW-UP
```
FOLLOW-UP 3 DIAS → FOLLOW-UP 7 DIAS →
FOLLOW-UP 15 DIAS → INATIVO
        └─ REATIVADO (volta para Funil 1)
```

#### FUNIL 3: ATENDIMENTO HUMANO
```
ESCALADO → EM ATENDIMENTO HUMANO →
├─ RESOLVIDO QUALIFICADO (volta Funil 1)
└─ RESOLVIDO DESQUALIFICADO (Funil 2)
```

### 4. AUTOMAÇÕES E INTEGRAÇÕES

#### N8N Workflows:
1. **Entrada de Lead:** WhatsApp/Instagram → Kommo
2. **Ativação IA:** Trigger após 2min → Agente Alice
3. **Qualificação:** IA qualifica → Notifica equipe
4. **Follow-up:** Timer automático → Reativação
5. **Agendamento:** Qualificado → MedX integration
6. **Notificações:** Telegram para equipe

#### Kommo Automações:
- Movimentação entre etapas
- Aplicação de tags automática
- Cálculo de score de qualificação
- Alertas de SLA
- Relatórios automáticos

### 5. INTEGRAÇÃO MedX

**Funcionalidades:**
- Consulta de disponibilidade
- Agendamento automático
- Confirmação de horários
- Notificações pré-consulta
- Gestão de fila de espera

**Workflow:**
```
Lead Qualificado → Alice consulta MedX →
Apresenta opções → Lead escolhe →
Confirmação automática → Notificações
```

## DADOS E CAMPOS PERSONALIZADOS

### Dados Obrigatórios
- Nome completo
- Telefone/Email
- Cidade/Estado
- Objetivo principal
- Capacidade financeira

### Dados de Refinamento
- Urgência expressa (Sim/Não)
- Tentativas anteriores (Sim/Não)
- Interesse método (Sim/Não)
- Disponibilidade agenda (Lista)
- Busca medicação (Sim/Não)

### Dados Operacionais
- Fonte do lead
- Data primeiro contato
- Número de interações
- Score qualificação (1-10)
- Próximo follow-up
- Motivo não agendamento

## MÉTRICAS E DASHBOARD

### KPIs Principais
- Taxa de qualificação (Meta: >25%)
- Tempo médio qualificação (Meta: <10min)
- Taxa de agendamento (Meta: >60% qualificados)
- Taxa reativação follow-up (Meta: >15%)
- Score médio de qualificação
- Valor médio por lead qualificado

### Dashboard Operacional
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  LEADS HOJE     │  │ QUALIFICADOS    │  │   AGENDADOS     │
│     142         │  │      38         │  │      23         │
│   ↑ 12%        │  │   ↑ 8%         │  │   ↑ 15%        │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ FOLLOW-UP HOJE  │  │ ESCALAÇÕES      │  │ TEMP. MÉD QUAL │
│      64         │  │       5         │  │    7.3 min      │
│   ↓ 3%         │  │   → 2%         │  │   ↓ 1.2 min     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Relatórios Automáticos
- **Diário (9h):** Performance do dia anterior
- **Semanal (segunda 9h):** Consolidado da semana
- **Mensal:** Análise detalhada + otimizações

## SEGURANÇA E COMPLIANCE

### Proteção de Dados
- Criptografia end-to-end nas conversas
- Backup automático diário
- Acesso controlado por perfis
- Log de auditoria completo

### Compliance Médico
- Não diagnósticos via IA
- Escalação imediata para emergências
- Linguagem adequada (não substitui consulta)
- Disclaimer em todas as comunicações

### Contingências
- Fallback para atendimento humano
- Backup de prompts e condicionais
- Monitoramento 24/7 da IA
- Protocolos de erro e recuperação

## ESCALABILIDADE

### Capacidade Atual
- 500 leads/dia simultâneos
- 95% uptime garantido
- Resposta média <30 segundos
- Suporte para múltiplos canais

### Planos de Expansão
1. **Fase 2:** Integração com site próprio
2. **Fase 3:** Multi-especialidades
3. **Fase 4:** Chatbot em website
4. **Fase 5:** App móvel próprio

## IMPLEMENTAÇÃO

### Cronograma de Deploy
```
Semana 1-2: Configuração Kommo + N8N
Semana 3: Implementação Agente IA
Semana 4: Testes e refinamentos
Semana 5: Treinamento equipe
Semana 6: Go-live monitorado
```

### Critérios de Sucesso
- 90% leads processados automaticamente
- Redução 60% tempo qualificação manual
- Aumento 40% taxa de agendamento
- ROI positivo em 60 dias

Esta arquitetura garante um sistema robusto, escalável e focado na conversão através de automação inteligente, mantendo a qualidade do atendimento e o foco na realidade estética do negócio.