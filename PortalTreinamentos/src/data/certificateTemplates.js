export const certificateTemplates = {
  marketingProducts: {
    id: 'marketing-products',
    programTitle: 'Marketing de Produtos',
    institution: 'Portal Treinamentos BBDI',
    headline: 'Certificado de Conclusão',
    placeholderName: '{{nome}}',
    statement:
      'Certificamos que {{nome}} concluiu com êxito a trilha de treinamento de {{programa}}, demonstrando domínio dos critérios de identificação, compatibilidade e atendimento técnico.',
    footerNote: 'Documento emitido automaticamente pelo portal de treinamentos.',
  },
  generic: {
    id: 'generic',
    programTitle: 'Treinamento Corporativo',
    institution: 'Grupo BBDI',
    headline: 'Certificado de Excelência',
    placeholderName: '{{nome}}',
    statement:
      'A jornada do conhecimento é infinita, e cada passo dado é uma vitória. Certificamos que {{nome}} concluiu com excelência o treinamento de {{programa}}, demonstrando dedicação e compromisso com o crescimento profissional.',
    footerNote: 'Documento emitido digitalmente pelo Grupo BBDI.',
  },
};

export const fillTemplate = (value, replacements = {}) => {
  if (!value) return '';

  return value.replace(/\{\{(\w+)\}\}/g, (_, token) => replacements[token] ?? '');
};
