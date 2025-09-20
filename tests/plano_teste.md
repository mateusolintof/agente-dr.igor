## Fase 1: Testes de Integração (Semana 1)

### Teste 1.1: Webhook Kommo → N8N
- **Objetivo:** Validar recebimento de dados
- **Método:** Enviar 10 leads teste com diferentes características
- **Critério de Sucesso:** 100% dos leads processados em < 5 segundos
- **Responsável:** Equipe Técnica

### Teste 1.2: IA Alice - Compreensão e Respostas
- **Cenários de Teste:**
  1. Paciente direto: "Quero marcar consulta"
  2. Paciente com dúvidas: "O que é bioimpedância?"
  3. Paciente com objeção: "Está muito caro"
  4. Paciente indeciso: "Preciso pensar"
  5. Paciente urgente: "Preciso emagrecer urgentemente"
  
- **Critério de Sucesso:** 
  - Respostas coerentes em 95% dos casos
  - Uso correto de linguagem formal em 100% dos casos
  - Score calculado corretamente

## Fase 2: Testes de Experiência (Semana 2)

### Teste 2.1: Jornada Completa do Paciente
- **Método:** 20 personas diferentes percorrendo todo o funil
- **Métricas:**
  - Tempo médio de qualificação: < 10 minutos
  - Taxa de handoff bem-sucedido: > 90%
  - Satisfação (pergunta direta): > 8/10

### Teste 2.2: Stress Test
- **Volume:** 100 conversas simultâneas
- **Duração:** 2 horas
- **Monitoramento:**
  - Tempo de resposta da IA
  - Taxa de erro
  - Performance do servidor

## Fase 3: Testes de Conversão (Semana 3-4)

### Teste 3.1: A/B Testing de Scripts
- **Variante A:** Script original (formal tradicional)
- **Variante B:** Script com gatilhos de urgência aumentados
- **Amostra:** 200 leads (100 cada)
- **Métrica Principal:** Taxa de conversão

### Teste 3.2: Otimização de Follow-up
- **Teste:** Diferentes intervalos de follow-up (6h, 24h, 48h)
- **Métrica:** Taxa de reengajamento