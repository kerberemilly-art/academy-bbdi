import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { certificateTemplates, fillTemplate } from '../../data/certificateTemplates';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    fontFamily: 'Helvetica',
  },
  border: {
    flex: 1,
    borderWidth: 10,
    borderColor: '#1e3a8a', // Navy blue
    padding: 2,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#3b82f6', // Brighter blue
    padding: 30,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoPlaceholder: {
    marginBottom: 10,
  },
  logoTextGrupo: {
    fontSize: 24,
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  logoTextBBDI: {
    fontSize: 32,
    color: '#94a3b8',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  institution: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 5,
  },
  headline: {
    fontSize: 42,
    color: '#1e3a8a',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  kicker: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 10,
  },
  name: {
    fontSize: 48,
    color: '#2563eb',
    marginBottom: 20,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  statement: {
    fontSize: 16,
    lineHeight: 1.6,
    color: '#334155',
    maxWidth: 600,
    marginBottom: 40,
    fontStyle: 'italic',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  signatureContainer: {
    alignItems: 'center',
    width: 250,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#1e3a8a',
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  signatureTitle: {
    fontSize: 12,
    color: '#64748b',
  },
  meta: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  id: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
});

const formatDate = (date) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}).format(new Date(date));

const GenericCertificateDocument = ({ certificate }) => {
  const template = certificateTemplates.generic;
  const fullName = certificate?.userName?.trim() || template.placeholderName;
  const programName = certificate?.moduleTitle || template.programTitle;
  const issuedAt = certificate?.issuedAt ? formatDate(certificate.issuedAt) : formatDate(new Date());

  return (
    <Document title={`Certificado - ${fullName}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            <View style={styles.header}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoTextGrupo}>Grupo</Text>
                <Text style={styles.logoTextBBDI}>BBDI</Text>
              </View>
              <Text style={styles.institution}>{template.institution}</Text>
            </View>

            <Text style={styles.headline}>{template.headline}</Text>
            
            <Text style={styles.kicker}>Certificamos com orgulho que</Text>
            <Text style={styles.name}>{fullName}</Text>
            
            <Text style={styles.statement}>
              {fillTemplate(template.statement, {
                nome: fullName,
                programa: programName,
              })}
            </Text>

            <View style={styles.footer}>
              <View style={styles.signatureContainer}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Diretoria Executiva</Text>
                <Text style={styles.signatureTitle}>{template.institution}</Text>
              </View>

              <View style={styles.meta}>
                <Text style={styles.date}>Emitido em: {issuedAt}</Text>
                <Text style={styles.id}>ID: {certificate?.id?.slice(0, 8).toUpperCase() || 'VALIDATION-PENDING'}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenericCertificateDocument;
