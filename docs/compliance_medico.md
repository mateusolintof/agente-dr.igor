# Compliance Médico e Legal - Dr. Igor

## Regulamentações Aplicáveis

### Código de Ética Médica
**Artigos Relevantes**:
- Art. 37: Prescrição sem exame físico
- Art. 73: Publicidade médica enganosa
- Art. 102: Revelar informações confidenciais

**Aplicação no Bot**:
- Nunca prescrever medicamentos
- Não interpretar exames
- Manter sigilo das informações
- Direcionar sempre para consulta

## Protocolos de Segurança

### 1. Limitações do Bot

O QUE O BOT PODE FAZER:
✅ Informar sobre serviços da clínica
✅ Explicar procedimentos (bioimpedância)
✅ Agendar consultas
✅ Esclarecer dúvidas administrativas

O QUE O BOT NÃO PODE FAZER:
❌ Fazer diagnósticos
❌ Prescrever medicamentos
❌ Interpretar exames
❌ Dar conselhos médicos específicos
❌ Substituir consulta médica

### 2. Escalonamento Obrigatório
```javascript
// Condições para transferir para humano médico
const condicoesEscalonamento = [
  'sintomas_especificos',
  'perguntas_medicamentos',
  'interpretacao_exames',
  'urgencia_medica',
  'questoes_clinicas'
];

// Resposta padrão de transferência
const mensagemTransferencia = `
Para questões clínicas específicas, vou
transferir você para nossa equipe médica.
Aguarde um momento, por favor.
`;
```

### 3. Disclaimers Contextuais
```javascript
const disclaimers = {
  bioimpedancia: "A bioimpedância é um exame que avalia composição corporal. Resultados e interpretações só podem ser fornecidos pelo médico durante a consulta.",

  nutricao: "Orientações nutricionais específicas só podem ser dadas após avaliação médica completa. Cada paciente tem necessidades individuais.",

  medicamentos: "Não posso fornecer informações sobre medicamentos. Questões sobre prescrições devem ser discutidas diretamente com o Dr. Igor.",

  resultados: "Resultados de tratamentos variam entre pacientes. O Dr. Igor poderá esclarecer expectativas realistas durante a consulta."
};
```
