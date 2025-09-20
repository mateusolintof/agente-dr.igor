# Campos Personalizados - Kommo

## CAMPOS OBRIGATÓRIOS

### 1. DADOS BÁSICOS
- **nome_completo** (Texto)
  - Obrigatório: Sim
  - Fonte: Primeira interação com IA

- **telefone** (Telefone)
  - Obrigatório: Para qualificação
  - Formato: (XX) XXXXX-XXXX

- **email** (Email)
  - Obrigatório: Para qualificação (alternativa ao telefone)

- **cidade_estado** (Texto)
  - Obrigatório: Sim
  - Determina: Presencial ou Online

### 2. QUALIFICAÇÃO PRINCIPAL

- **objetivo_principal** (Lista suspensa)
  - Opções:
    - Emagrecimento
    - Definição corporal
    - Perda de peso
    - Melhorar metabolismo
    - Reduzir medidas
    - Ganho de massa magra
    - Outro (especificar)

- **capacidade_financeira** (Lista suspensa)
  - Opções:
    - Demonstrou interesse no investimento
    - Perguntou formas de pagamento
    - Não objetou ao preço
    - Objetou fortemente ao preço
    - Insiste apenas em convênio

### 3. REFINAMENTO DE QUALIFICAÇÃO

- **urgencia_expressa** (Sim/Não)
  - Indicadores: "preciso resolver logo", "urgente", "não aguento mais"

- **tentativas_anteriores** (Sim/Não)
  - Histórico: "já tentei dietas", "fiz tratamento antes", "não funcionou"

- **perguntas_metodo** (Sim/Não)
  - Interesse: "como funciona", "qual diferencial", "resultados esperados"

- **disponibilidade_agenda** (Lista suspensa)
  - Opções:
    - Flexível horários
    - Apenas manhã
    - Apenas tarde
    - Apenas online
    - Fins de semana
    - Não informou

- **busca_medicacao** (Sim/Não)
  - Exemplos: "ozempic", "mounjaro", "medicamentos para emagrecimento"

### 4. CONTROLE OPERACIONAL

- **canal_preferido** (Lista suspensa)
  - Opções:
    - Presencial
    - Online
    - Sem preferência
    - Não informado

- **motivo_nao_agendamento** (Lista suspensa)
  - Opções:
    - Precisa pensar
    - Consultar cônjuge/família
    - Questões de agenda
    - Objeção de preço
    - Quer apenas convênio
    - Não é o público-alvo
    - Outro

- **fonte_lead** (Lista suspensa)
  - Opções:
    - WhatsApp Business
    - Instagram
    - Facebook
    - Google Ads
    - Indicação
    - Site
    - Outro

### 5. HISTÓRICO DE INTERAÇÕES

- **data_primeiro_contato** (Data/Hora)
  - Preenchimento: Automático

- **data_ultima_interacao** (Data/Hora)
  - Atualização: Automática

- **numero_interacoes** (Número)
  - Contador: Automático

- **tempo_resposta_lead** (Texto)
  - Média: Tempo entre mensagens do sistema e respostas do lead

### 6. FOLLOW-UP E REATIVAÇÃO

- **proximo_followup** (Data)
  - Agendamento: Automático baseado na etapa

- **tipo_followup** (Lista suspensa)
  - Opções:
    - 3 dias
    - 7 dias
    - 15 dias
    - Manual
    - Não aplicável

- **resposta_followup** (Lista suspensa)
  - Opções:
    - Respondeu positivamente
    - Respondeu negativamente
    - Não respondeu
    - Solicitou mais tempo

### 7. QUALIDADE DO LEAD

- **score_qualificacao** (Número 1-10)
  - Cálculo baseado em:
    - Objetivo claro (0-5 pontos)
    - Capacidade financeira (0-3 pontos)
    - Urgência (0-1 ponto)
    - Histórico anterior (0-1 ponto)

- **probabilidade_conversao** (Lista suspensa)
  - Opções:
    - Alta (8-10 pontos)
    - Média (5-7 pontos)
    - Baixa (1-4 pontos)
    - Muito baixa (0 pontos)

### 8. OBSERVAÇÕES E NOTAS

- **observacoes_ia** (Texto longo)
  - Preenchimento: Automático pelo agente IA
  - Conteúdo: Resumo da conversa, objeções, insights

- **observacoes_humano** (Texto longo)
  - Preenchimento: Manual pela equipe
  - Conteúdo: Observações adicionais, estratégias

## AUTOMAÇÕES DE PREENCHIMENTO

### Baseadas em Palavras-chave:
- "emagrecer", "perder peso" → objetivo_principal = "Emagrecimento"
- "definir", "tonificar" → objetivo_principal = "Definição corporal"
- "urgente", "preciso logo" → urgencia_expressa = "Sim"
- "já tentei", "fiz antes" → tentativas_anteriores = "Sim"

### Baseadas em Comportamento:
- Perguntou sobre preço → capacidade_financeira positiva
- Objetou preço → capacidade_financeira negativa
- Perguntou agendamento → disponibilidade_agenda = "Flexível"

## RELATÓRIOS SUGERIDOS

### Dashboard Principal:
- Distribuição por objetivo_principal
- Taxa de qualificação por capacidade_financeira
- Efetividade do follow-up por tipo
- Score médio de qualificação por fonte

### Análise de Performance:
- Leads qualificados vs tempo_resposta_lead
- Correlação entre tentativas_anteriores e conversão
- Impact de urgencia_expressa na taxa de agendamento