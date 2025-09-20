# Workflow Operacional - Agente de Atendimento

## FLUXO PRINCIPAL DE ATENDIMENTO

### 1. ENTRADA DE LEAD
```
┌─────────────────┐
│   NOVO LEAD     │
│   WhatsApp/IG   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ REGISTRA KOMMO  │
│ Status: NOVO    │
│ Timer: 2min     │
└─────────┬───────┘
          │
          ▼ (após 2min)
┌─────────────────┐
│ ATIVA AGENTE IA │
│ Alice entra     │
│ Status: EM ATD  │
└─────────────────┘
```

### 2. FLUXO DE ACOLHIMENTO
```
ALICE INICIA:
"Boa [período], sou Alice, assistente do Instituto Aguiar Neri.
É um prazer recebê-lo(a). Poderia me informar seu nome completo
para que eu possa atendê-lo(a) de forma personalizada?"

┌─ Lead responde nome ──────┐
│                           │
▼                           ▼
CONTINUA FLUXO              LEAD NÃO RESPONDE
                           (24h sem resposta)
                           │
                           ▼
                           MOVE PARA FOLLOW-UP 3 DIAS
```

### 3. DESCOBERTA INTELIGENTE
```
IF: Lead já mencionou objetivo na primeira mensagem
THEN:
    "Senhor(a) [Nome], entendi que busca [objetivo].
    Para orientá-lo da melhor forma, já buscou algum
    tratamento para isso anteriormente?"

    TAG: "objetivo_claro" = True

ELSE:
    "Senhor(a) [Nome], para que eu possa orientá-lo(a)
    da melhor forma, qual o seu principal objetivo?
    O que está buscando alcançar?"

    AGUARDA RESPOSTA → TAG: "objetivo_claro" = True/False
```

### 4. MAPEAMENTO DE LOCALIZAÇÃO
```
"Senhor(a) [Nome], para melhor atendê-lo(a),
poderia informar de qual cidade está falando conosco?"

┌─ Feira de Santana ─────────┐     ┌─ Outras Cidades ────────┐
│                            │     │                         │
▼                            │     ▼                         │
ENFATIZA PRESENCIAL          │     TRANQUILIZA ONLINE       │
+ BIOIMPEDÂNCIA             │     + CASOS SUCESSO          │
                            │                              │
└────────────┬───────────────┘     └────────────┬───────────┘
             │                                  │
             └──────────┬──────────────────────┘
                        │
                        ▼
                   CONTINUA FLUXO
```

### 5. APLICAÇÃO DE CONDICIONAIS
```
BASEADO NA RESPOSTA DO LEAD, ATIVA CONDICIONAIS:

┌─ Emagrecimento ────────────┐  ┌─ Definição/Estética ─────┐
│ "Perfeito! Se posso       │  │ "Excelente! Está bus-    │
│ perguntar, quanto gosta-  │  │ cando reduzir medidas    │
│ ria de eliminar?"         │  │ em alguma região?"       │
└───────────────────────────┘  └──────────────────────────┘

┌─ Medicação (Ozempic) ──────┐  ┌─ Frustração Anterior ────┐
│ "Entendo seu interesse.    │  │ "Compreendo sua frustra-  │
│ Dr. Igor é especialista    │  │ ção. Com Dr. Igor será   │
│ em tratamentos seguros."   │  │ uma experiência diferente"│
└───────────────────────────┘  └──────────────────────────┘
```

### 6. AVALIAÇÃO DE CAPACIDADE FINANCEIRA
```
APRESENTA SOLUÇÃO + PREÇO:
"O valor do programa completo é R$ 700,00"

┌─ NÃO OBJETA ────────────┐    ┌─ OBJETA PREÇO ──────────┐
│ "Como posso agendar?"   │    │ "Muito caro/Convênio"   │
│ "Formas de pagamento?"  │    │                         │
│                         │    │                         │
▼                         │    ▼                         │
TAG: capacidade_positiva  │    TAG: capacidade_negativa │
                         │                              │
└─────────┬───────────────┘    └─────────┬───────────────┘
          │                              │
          ▼                              ▼
     QUALIFICADO                    TRABALHA OBJEÇÃO
                                        │
                                        ▼
                                   REAVALIA INTERESSE
```

### 7. DECISÃO DE QUALIFICAÇÃO
```
CRITÉRIOS AVALIADOS:
✓ objetivo_claro = True
✓ capacidade_financeira = Positiva
✓ Dados obrigatórios coletados

┌─ AMBOS CRITÉRIOS ─────────┐    ┌─ CRITÉRIOS PARCIAIS ────┐
│ ATENDIDOS                 │    │ OU INTERESSE DEMONSTRADO │
│                           │    │                          │
▼                           │    ▼                          │
TRANSFERE PARA HUMANO       │    MOVE PARA FOLLOW-UP       │
                           │                               │
"Vou transferir para nossa  │    "Vou manter seu contato   │
equipe que verificará a     │    e em alguns dias envio    │
melhor data e horário."     │    informações adicionais."  │
                           │                               │
TAG: "lead_qualificado"     │    TAG: "follow_up_3_dias"   │
NOTIFICA EQUIPE            │    AGENDA FOLLOW-UP           │
└───────────────────────────┘    └──────────────────────────┘
```

## WORKFLOWS DE AUTOMAÇÃO

### WORKFLOW 1: ENTRADA E ATIVAÇÃO
```yaml
Trigger: Novo lead criado no Kommo
Ações:
  1. Aguardar 2 minutos
  2. Verificar se lead respondeu
  3. Se não respondeu: Ativar Alice
  4. Enviar primeira mensagem
  5. Mover para "EM ATENDIMENTO IA"
  6. Definir timeout de 24h
```

### WORKFLOW 2: QUALIFICAÇÃO AUTOMÁTICA
```yaml
Trigger: Tag "lead_qualificado" aplicada
Ações:
  1. Mover para status "QUALIFICADO"
  2. Notificar equipe via Telegram
  3. Criar tarefa: "Contatar lead em 2h"
  4. Calcular score de qualificação
  5. Preparar dados para MedX
```

### WORKFLOW 3: ESCALAÇÃO HUMANA
```yaml
Trigger: Tag "escalacao_humana" aplicada
Ações:
  1. Pausar automações de IA
  2. Mover para "ESCALADO PARA HUMANO"
  3. Notificar supervisor imediato
  4. Criar tarefa urgente
  5. Resumir contexto em nota
```

### WORKFLOW 4: FOLLOW-UP AUTOMATIZADO
```yaml
Trigger: Tag "follow_up_3_dias" aplicada
Ações:
  1. Mover para funil Follow-up
  2. Definir data +3 dias
  3. Selecionar prompt adequado
  4. Agendar envio automático
  5. Monitorar resposta
```

## TRATAMENTO DE EXCEÇÕES

### CENÁRIO 1: LEAD SEM RESPOSTA PROLONGADA
```
SE: 24h sem resposta em "EM ATENDIMENTO IA"
ENTÃO:
  1. Move para "FOLLOW-UP 3 DIAS"
  2. Tag "sem_resposta_inicial"
  3. Agenda reativação automática
```

### CENÁRIO 2: EMERGÊNCIA MÉDICA
```
SE: Palavras-chave ["emergência", "dor", "urgente médico"]
ENTÃO:
  1. Escalação imediata
  2. Notificação prioritária
  3. Tag "emergencia_medica"
  4. SLA 15 minutos resposta
```

### CENÁRIO 3: RECLAMAÇÃO/INSATISFAÇÃO
```
SE: Palavras-chave ["reclamação", "insatisfeito", "problema"]
ENTÃO:
  1. Escalação para supervisor
  2. Tag "reclamacao"
  3. Protocolo especial atendimento
  4. Follow-up obrigatório
```

### CENÁRIO 4: FALHA TÉCNICA
```
SE: IA não responde em 60 segundos
ENTÃO:
  1. Ativar fallback humano
  2. Notificar suporte técnico
  3. Log detalhado do erro
  4. Continuar atendimento manual
```

## MÉTRICAS DE PERFORMANCE

### MÉTRICAS EM TEMPO REAL
- Leads em atendimento ativo
- Tempo médio de resposta da IA
- Taxa de qualificação atual
- Número de escalações hoje

### MÉTRICAS DIÁRIAS
- Total de leads processados
- % qualificados vs total
- Tempo médio de qualificação
- Principais motivos de desqualificação

### ALERTAS AUTOMÁTICOS
- SLA ultrapassado (>2h sem resposta)
- Taxa qualificação <20% (alerta amarelo)
- Taxa qualificação <15% (alerta vermelho)
- Falhas técnicas acumuladas

## OTIMIZAÇÃO CONTÍNUA

### ANÁLISE SEMANAL
- Revisão de conversas qualificadas
- Identificação de padrões de objeção
- Ajuste de prompts baseado em performance
- Atualização de condicionais

### A/B TESTING
- Teste de mensagens iniciais
- Variação de abordagem por objetivo
- Teste de timing de follow-up
- Otimização de quebra de objeções

### FEEDBACK LOOP
- Resultado de agendamentos → ajuste qualificação
- Feedback equipe humana → melhoria prompts
- Análise de leads perdidos → nova estratégia
- Cases de sucesso → replicação de abordagem

Este workflow garante operação eficiente, consistente e em constante otimização, mantendo o foco na conversão através de abordagem consultiva personalizada.