# Mapeamento de Condicionais

O conteúdo detalhado das regras foi convertido para o formato YAML para facilitar leitura e consumo pelos times técnicos. Consulte `docs/mapeamento_condicionais.yaml` para a versão estruturada com triggers, ações, atualizações no Kommo, follow-ups e fallbacks.

## Como usar
- Importe o YAML em ferramentas que suportem visualização hierárquica (VS Code, Obsidian, JSON/YAML viewers) ou carregue em automações/QA.
- Cada nó possui os campos `trigger`, `action`, `kommo_updates` e `remarks`, permitindo rastrear rapidamente o comportamento esperado do fluxo.
- Ajustes devem ser feitos diretamente no arquivo `.yaml`, mantendo versionamento via git.

> Dica: no VS Code instale a extensão "YAML" (Red Hat) para validação e colapso/expansão das seções.
