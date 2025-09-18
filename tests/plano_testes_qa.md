# Plano de Testes e Critérios de Aprovação - Dr. Igor

## 1. Objetivo
Garantir estabilidade, conformidade médico-jurídica e desempenho dos fluxos automatizados do Instituto Aguiar Neri antes do go-live e durante a operação contínua.

## 2. Escopo
- Workflows n8n: `workflows/fluxo_qualificacao.json`, `workflows/fluxo_followup.json`.
- Integrações Kommo ↔ n8n ↔ OpenAI ↔ MEDX.
- Prompts: `prompts/prompt_triagem_inicial.md`, `prompts/prompt_follow_up.md`, `prompts/system_prompt_triagem.md`, `prompts/system_prompt_followup.md`.
- Pipeline Kommo: `kommo-config/pipeline_config.json` e documento de apoio.
- Scripts auxiliares e endpoints (webhooks, APIs internas).

## 3. Papéis e Responsabilidades
| Papel | Responsável | Atribuições |
|-------|-------------|-------------|
| QA Líder | Especialista n8n | Planejar, executar e registrar testes automatizados e manuais. |
| Product Owner | Gestor Instituto | Validar critérios de aceite e aprovar go-live. |
| Time Médico | Dr. Igor + equipe | Avaliar respostas quanto a compliance clínico. |
| DevOps | Integrador | Criar e monitorar ambientes, versionar assets e garantir backups. |

## 4. Ambientes de Teste
| Ambiente | Finalidade | Notas |
|----------|-----------|-------|
| Kommo Sandbox | Exercitar pipeline sem impactar leads reais | Duplicar pipeline oficial antes do teste. |
| n8n Dev | Executar workflows com mocks | Usar credenciais de teste para OpenAI e MEDX. |
| n8n Staging | Simular produção com integrações reais | Trafegar dados mascarados. |
| OpenAI Testing | Validação de prompts | Ajustar limites para capturar respostas. |

## 5. Preparação (Pré-Teste)
1. Clonar ambiente Kommo de produção para sandbox (pipeline e campos).
2. Importar workflows n8n em workspace de teste e versionar.
3. Configurar variáveis de ambiente (tokens Kommo, OpenAI, MEDX, webhooks de teste).
4. Criar dados seed: leads fictícios com diferentes perfis e preferências de agenda.
5. Ativar logging detalhado (execuções n8n, timeline Kommo, chamadas de API).

## 6. Plano de Testes

### 6.1 Testes Unitários (n8n)
- `Webhook Kommo`: valida recebimento de payloads obrigatórios e rejeição quando faltar consentimento.
- `Processar Mensagem`: garante normalização de texto, identificação de objetivo e detecção de pedidos de agenda.
- `Consulta MEDX`: verifica parâmetros enviados, tratamento de indisponibilidade e respostas vazias.
- `Definir Próxima Ação`: confirma ramos if/else (coleta adicional, envio de opções, handoff humano, follow-up).
- `Salvar Logs`: confirma escrita em storage ou fallback quando indisponível.

### 6.2 Testes de Integração
- Kommo -> n8n: criar lead em Kommo e confirmar acionamento do webhook, atualização de status e campos customizados (`PREFERRED_SLOT`, `LAST_SUGGESTED_SLOTS`).
- n8n -> MEDX: validar busca de slots, tratamento de indisponibilidade e autenticação.
- n8n -> OpenAI: enviar prompts e validar tempo de resposta, tratamento de erro API (rate limit, timeout).
- n8n -> Kommo: aplicar mudanças de status (Triagem, Opções Enviadas, Follow-up, Handoff Humano), criar notas e tarefas.
- Follow-up Cron: simular cron diário, checar envio de mensagens, incremento de tentativas e pausa após 3 contatos.

### 6.3 Testes Funcionais (End-to-End)
- Cenário Lead Interessado: bot coleta dados essenciais, consulta MEDX, apresenta opções e, após o paciente escolher, cria tarefa para equipe humana.
- Cenário Lead Indeciso: bot coleta informações, envia opções, inicia follow-up em 24h e encerra após resposta humana.
- Cenário Sem Consentimento: lead recusa termos, fluxo encerra e campos são anonimizados.
- Cenário Objeção de Preço: bot aciona resposta padrão RAQ e mantém conversa ativa.
- Cenário MEDX Indisponível: workflow retorna mensagem de manutenção, registra preferência e gera tarefa manual.

### 6.4 Testes de Contingência e Fallback
- Falha OpenAI: verificar fallback de resposta estática e alerta para equipe.
- Timeout Kommo API: fluxo reprocessa em fila ou notifica suporte.
- Palavra de Emergência: resposta de emergência, registro e alerta imediato à equipe médica.
- Erro Cron: auditoria identifica falhas e inicia retry manual.

### 6.5 Testes de Desempenho
- Tempo de resposta do bot < 30 s em 20 execuções sequenciais.
- Throughput: simular 50 leads por hora e confirmar que a fila n8n não apresenta backlog.
- Monitorar consumo de tokens OpenAI (alerta em 80% do limite mensal).

### 6.6 Testes de Segurança e Compliance
- LGPD: consentimento registrado, direito de revogação respeitado, dados sensíveis mascarados nos logs.
- CFM: sem recomendações médicas; respostas orientam consulta presencial.
- Logs: auditoria contém ID do lead, carimbo de data/hora, preferências de agenda e decisões de handoff.

## 7. Critérios de Aprovação
| Categoria | Critério |
|-----------|---------|
| Funcional | 100% dos cenários críticos sem falha; regressão <= 2% em casos não críticos. |
| Performance | Tempo médio de resposta <= 30 s; nenhum timeout sem tratamento. |
| Segurança | Compliance LGPD/CFM validado pela equipe jurídica e médica. |
| Observabilidade | Dashboards com métricas essenciais operacionais; alertas configurados. |
| Documentação | Evidências arquivadas (capturas, logs) e checklist QA assinado. |

## 8. Registro de Evidências
- Plataforma: Notion ou Confluence (pasta QA Dr. Igor).
- Para cada caso de teste: ID, descrição, passos, resultado, evidência (screenshot ou log), responsável, data.
- Retenção mínima: 24 meses (alinhado à política de auditoria).

## 9. Checklist Pré Go-Live
- [ ] QA líder aprovou relatório final.
- [ ] Time médico revisou respostas de alto risco.
- [ ] Logs e monitoramento ativos.
- [ ] Plano de rollback definido (desativar workflows, reverter pipelines).
- [ ] Backup dos workflows e prompts exportados (.json, .md).
- [ ] Time de atendimento validou treinamento e scripts.

## 10. Plano de Regressão
- Executar regressão completa a cada alteração de workflow ou prompt crítico.
- Manter suíte de testes automatizados (quando possível via n8n/test runners).
- Documentar histórico de mudanças com link para evidências de teste.

## 11. Monitoramento Pós Go-Live
- Primeiras 72h: acompanhamento horário (alertas em tempo real).
- Semana 1: revisão diária de métricas e exceções.
- Mensal: auditoria cruzada com compliance e time médico.
- Gatilhos de revisão: queda de conversão > 5 p.p., aumento de reclamações, incidentes LGPD.

## 12. Plano de Melhoria Contínua
- Sprint mensal de QA para revisar casos perdidos, atualizar prompts e ajustar regras de follow-up.
- Implementar testes automáticos em n8n (HTTP Request + webhook) via cron semanal.
- Coletar feedback do atendimento humano para refinar cenários de testes e critérios de aceite futuros.
