# Workflow Operacional - Sistema de Follow-up

## VISÃO GERAL DO SISTEMA

### Objetivo
Reativar leads que demonstraram interesse inicial mas não se qualificaram imediatamente, através de sequência automatizada e personalizada de follow-ups.

### Filosofia
"Nutrir relacionamento sem pressão, oferecendo valor contínuo até o momento ideal para conversão"

## FLUXO PRINCIPAL DE FOLLOW-UP

### ENTRADA NO SISTEMA
```
┌─ Leads de Entrada ──────────────────────────────────────┐
│                                                         │
├─ Desqualificado com interesse demonstrado              │
├─ "Precisa pensar" / "Consultar família"               │
├─ Objeção de preço trabalhada mas não resolvida        │
├─ Questões de agenda/timing                            │
├─ Sem resposta há 24h no atendimento inicial           │
│                                                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
            CLASSIFICAÇÃO AUTOMÁTICA
```

### CLASSIFICAÇÃO E SEGMENTAÇÃO
```
┌─ PERFIL A: ALTA INTENÇÃO ─────────┐
│ - Perguntou preço/formas pagamento │
│ - Questionou disponibilidade       │
│ - Mencionou urgência               │
│ - Histórico de tentativas          │
│                                    │
│ FOLLOW-UP: 3-7-15 dias            │
│ PROMPT: Orientado a conversão      │
└────────────────────────────────────┘

┌─ PERFIL B: MÉDIA INTENÇÃO ────────┐
│ - Interesse mas resistências      │
│ - Precisa consultar terceiros      │
│ - Questões de timing              │
│ - Objeções de distância           │
│                                    │
│ FOLLOW-UP: 7-15-30 dias           │
│ PROMPT: Educativo e valor         │
└────────────────────────────────────┘

┌─ PERFIL C: BAIXA INTENÇÃO ───────┐
│ - Apenas curiosidade              │
│ - Sem objeções específicas        │
│ - Muito jovem ou idoso             │
│ - Fora do perfil ideal            │
│                                    │
│ FOLLOW-UP: 15-30-60 dias          │
│ PROMPT: Educativo e awareness     │
└────────────────────────────────────┘
```

## SEQUÊNCIA DE FOLLOW-UP

### FOLLOW-UP 3 DIAS (ALTA INTENÇÃO)
```
TRIGGER: 72h após última interação
STATUS: "FOLLOW-UP 3 DIAS"

SELEÇÃO DE PROMPT:
┌─ Se tag "objecao_preco" ─────────┐
│ PROMPT: Valor vs Custo          │
│ Foco: ROI e benefícios          │
└─────────────────────────────────┘

┌─ Se tag "consultar_familia" ────┐
│ PROMPT: Apoio familiar          │
│ Foco: Informações para decisão  │
└─────────────────────────────────┘

┌─ Se tag "urgencia_expressa" ────┐
│ PROMPT: Oportunidade limitada   │
│ Foco: Vagas disponíveis        │
└─────────────────────────────────┘

AÇÕES AUTOMÁTICAS:
1. Enviar mensagem personalizada
2. Aguardar resposta 24h
3. SE resposta positiva → Reativar IA
4. SE sem resposta → Próximo follow-up
```

### FOLLOW-UP 7 DIAS (REFORÇO)
```
TRIGGER: 7 dias do follow-up anterior
STATUS: "FOLLOW-UP 7 DIAS"

ESTRATÉGIA: Abordagem diferente
- Caso de sucesso relevante
- Nova perspectiva sobre objeção
- Informação adicional valiosa
- Facilidade de pagamento (se apropriado)

PROMPTS ESPECIALIZADOS:
┌─ Para objeção preço ─────────────┐
│ "R$ 7,80/dia vs delivery diário" │
│ Contextualização de valor        │
└──────────────────────────────────┘

┌─ Para outras cidades ───────────┐
│ Cases de sucesso online          │
│ Praticidade vs presencial       │
└──────────────────────────────────┘

┌─ Para jovens (estética) ────────┐
│ Metabolismo jovem + resultados   │
│ Comparação com tentativas DIY    │
└──────────────────────────────────┘

AÇÕES:
1. Novo prompt baseado em perfil
2. Aguardar 48h resposta
3. Registrar tipo de interação
4. Próximo follow-up ou inativação
```

### FOLLOW-UP 15 DIAS (FINAL)
```
TRIGGER: 15 dias do follow-up anterior
STATUS: "FOLLOW-UP 15 DIAS"

ESTRATÉGIA: Última oportunidade
- Senso de perda e urgência
- Vagas limitadas reais
- Benefício final exclusivo
- Reflexão sobre consequências de esperar

PROMPT UNIVERSAL:
"Esta será minha última mensagem...
Apenas 2 vagas disponíveis este mês...
Próximas datas apenas em [próximo mês]...
Se ainda tem interesse em resolver [objetivo]..."

PERSONALIZAÇÕES:
- Histórico de tentativas → "Talvez a diferença não seja mais uma tentativa, mas uma abordagem completamente diferente"
- Jovens → "Enquanto amigos ficam tentando dietas da internet..."
- Medicação → "Protocolo seguro vs tentativas por conta própria"

AÇÕES FINAIS:
1. Enviar mensagem final
2. Aguardar 72h resposta
3. SE resposta → Reativar IA
4. SE sem resposta → Mover para INATIVO
```

## WORKFLOWS DE AUTOMAÇÃO

### WORKFLOW 1: ENTRADA EM FOLLOW-UP
```yaml
Nome: "Entrada Sistema Follow-up"
Trigger: Tag "follow_up_[dias]" aplicada

Ações:
  1. Mover para Funil Follow-up
  2. Classificar perfil (A/B/C)
  3. Definir sequência personalizada
  4. Agendar primeiro follow-up
  5. Registrar motivo entrada
  6. Calcular probabilidade reativação
```

### WORKFLOW 2: EXECUÇÃO FOLLOW-UP
```yaml
Nome: "Execução Follow-up Automatizado"
Trigger: Data follow-up atingida

Condições:
  - Lead em status follow-up
  - Não respondeu desde último contato
  - Não foi reativado manualmente

Ações:
  1. Selecionar prompt adequado
  2. Personalizar com dados do lead
  3. Enviar mensagem via WhatsApp
  4. Definir timeout para resposta
  5. Agendar próximo follow-up
  6. Atualizar métricas
```

### WORKFLOW 3: RESPOSTA POSITIVA
```yaml
Nome: "Reativação de Lead"
Trigger: Resposta em follow-up

Condições:
  - Mensagem contém palavras positivas
  - Lead demonstra interesse renovado

Ações:
  1. Mover para "EM ATENDIMENTO IA"
  2. Tag "reativado_followup_[dias]"
  3. Ativar Alice com contexto
  4. Notificar equipe sobre reativação
  5. Atualizar score qualificação +2
```

### WORKFLOW 4: INATIVAÇÃO FINAL
```yaml
Nome: "Inativação de Lead"
Trigger: 72h sem resposta no follow-up final

Ações:
  1. Mover para status "INATIVO"
  2. Tag "inativo_apos_followup"
  3. Arquivar da automação ativa
  4. Incluir em campanha remarketing
  5. Agendar revisão em 6 meses
```

## PERSONALIZAÇÃO INTELIGENTE

### DETECÇÃO DE PERFIL
```python
def classificar_perfil(lead):
    score = 0

    # Interesse demonstrado
    if lead.tags.contains("perguntou_preco"): score += 3
    if lead.tags.contains("urgencia_expressa"): score += 2
    if lead.tags.contains("tentativas_anteriores"): score += 2
    if lead.tags.contains("perguntas_metodo"): score += 1

    # Resistências
    if lead.tags.contains("objecao_preco_forte"): score -= 2
    if lead.tags.contains("fora_perfil"): score -= 3
    if lead.tags.contains("apenas_curiosidade"): score -= 2

    if score >= 5: return "PERFIL_A"
    elif score >= 2: return "PERFIL_B"
    else: return "PERFIL_C"
```

### SELEÇÃO DE PROMPT
```python
def selecionar_prompt(lead, dia_followup):
    perfil = classificar_perfil(lead)
    objecao_principal = lead.get_objecao_principal()

    prompts = {
        "PERFIL_A": {
            3: prompt_alta_intencao_3d,
            7: prompt_alta_intencao_7d,
            15: prompt_final_urgencia
        },
        "PERFIL_B": {
            7: prompt_media_intencao_7d,
            15: prompt_media_intencao_15d,
            30: prompt_educativo_30d
        },
        "PERFIL_C": {
            15: prompt_baixa_intencao_15d,
            30: prompt_educativo_30d,
            60: prompt_awareness_60d
        }
    }

    # Personalização por objeção
    if objecao_principal == "preco":
        return prompt_valor_vs_custo[dia_followup]
    elif objecao_principal == "distancia":
        return prompt_online_success[dia_followup]

    return prompts[perfil][dia_followup]
```

## MÉTRICAS E OTIMIZAÇÃO

### KPIs DE FOLLOW-UP
- **Taxa de Resposta por Follow-up:** % que respondem em cada etapa
- **Taxa de Reativação:** % que voltam para atendimento ativo
- **Conversão Pós-Follow-up:** % que se qualificam após reativação
- **Tempo Médio Reativação:** Quantos dias entre follow-up e resposta
- **ROI do Follow-up:** Valor gerado vs custo da automação

### DASHBOARD FOLLOW-UP
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ FOLLOW-UP HOJE  │  │ REATIVAÇÕES     │  │ TAXA RESPOSTA   │
│      64         │  │      12         │  │     18.8%       │
│   ↑ 8%         │  │   ↑ 3          │  │   ↑ 2.1%       │
└─────────────────┘  └─────────────────┘  └─────────────────┘

FILA DE FOLLOW-UP HOJE:
├─ 3 dias: 23 leads (Perfil A: 15, B: 6, C: 2)
├─ 7 dias: 18 leads (Perfil A: 8, B: 10)
└─ 15 dias: 11 leads (Finais: 8, Educativo: 3)
```

### ANÁLISE DE PERFORMANCE
```
FOLLOW-UP 3 DIAS:
- Taxa resposta: 24% (meta: >20%)
- Reativação: 15% (meta: >12%)
- Melhor perfil: Alta intenção + objeção preço

FOLLOW-UP 7 DIAS:
- Taxa resposta: 18% (meta: >15%)
- Reativação: 11% (meta: >8%)
- Melhor prompt: Cases de sucesso online

FOLLOW-UP 15 DIAS:
- Taxa resposta: 12% (meta: >10%)
- Reativação: 7% (meta: >5%)
- Melhor abordagem: Urgência real + reflexão
```

## OTIMIZAÇÃO CONTÍNUA

### TESTES A/B MENSAIS
- Variação de timing (3 vs 4 dias)
- Diferentes abordagens de objeção
- Teste de horários de envio
- Personalização vs mensagem genérica

### FEEDBACK LOOP
- Leads que convertem após follow-up → Análise do que funcionou
- Leads que nunca respondem → Identificação de padrões
- Reativações que não convertem → Ajuste de qualificação

### SEGMENTAÇÃO AVANÇADA
- Por fonte do lead (Instagram vs WhatsApp)
- Por idade e objetivo
- Por região e modalidade preferida
- Por histórico de objeções

Este sistema de follow-up garante que nenhum lead interessado seja perdido, mantendo relacionamento profissional e oferecendo valor contínuo até o momento ideal para conversão.