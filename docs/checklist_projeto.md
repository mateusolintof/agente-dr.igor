# Checklist de Implementação - Projeto Dr. Igor

- [ ] Atualizar `docs/arquitetura_sistema.md` com novo fluxograma (consulta MEDX) e remover referências a scoring.
- [ ] Importar pipeline ajustado no Kommo conforme `kommo-config/pipeline_config.json` e criar campos customizados.
- [ ] Configurar variáveis de ambiente no n8n (`TRIAGEM_STATUS_ID`, `OPCOES_ENVIADAS_STATUS_ID`, etc.).
- [ ] Atualizar workflow `fluxo_qualificacao.json` para versão 2.0 (consulta MEDX + handoff imediato).
- [ ] Atualizar workflow `fluxo_followup.json` para versão 2.0 (sem score, foco em confirmação de agenda).
- [ ] Substituir prompts no n8n pelos novos system prompts de triagem e follow-up.
- [ ] Publicar documento de RAQ e garantir que o agente tenha acesso às respostas.
- [ ] Adicionar protocolos de contingência ao repositório interno e comunicar equipe.
- [ ] Validar integração com MEDX usando casos de teste (slot disponível / indisponível).
- [ ] Realizar testes ponta a ponta (lead real) e ajustar campos no Kommo conforme necessário.
- [ ] Registrar métricas iniciais e revisar KPIs com a equipe após primeira semana.
