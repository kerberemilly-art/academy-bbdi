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
    headline: 'CERTIFICADO DE EXCELÊNCIA',
    placeholderName: '{{nome}}',
    statement:
      'Concluiu com êxito a seguinte etapa de treinamento, demonstrando dedicação e compromisso com seu desenvolvimento profissional.',
    footerNote: 'Documento emitido digitalmente pelo Grupo BBDI.',
  },
};

export const fillTemplate = (value, replacements = {}) => {
  if (!value) return '';

  return value.replace(/\{\{(\w+)\}\}/g, (_, token) => replacements[token] ?? '');
};

export const capitalizeName = (name) => {
  if (!name) return '';
  const exceptions = ['da', 'de', 'do', 'das', 'dos', 'e'];
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (exceptions.includes(word) && index !== 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
