import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { certificateTemplates, fillTemplate, capitalizeName } from '../../data/certificateTemplates';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    fontFamily: 'Helvetica',
  },
  border: {
    flex: 1,
    borderWidth: 8,
    borderColor: '#004A99', // BBDI Deep Blue
    padding: 3,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#94a3b8', // Subtle slate/gray
    padding: 30,
    backgroundColor: '#ffffff', 
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoPlaceholder: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoTextGrupo: {
    fontSize: 20,
    color: '#004A99', // BBDI Deep Blue
    fontWeight: 'bold',
    marginRight: 4,
  },
  logoTextBBDI: {
    fontSize: 28,
    color: '#475569', // Slate
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  institution: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 5,
  },
  headline: {
    fontSize: 34,
    color: '#004A99', // BBDI Deep Blue
    marginVertical: 15,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  kicker: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 42,
    color: '#004A99', // BBDI Deep Blue
    marginBottom: 20,
    fontWeight: 'bold',
  },
  statement: {
    fontSize: 13,
    lineHeight: 1.6,
    color: '#334155',
    maxWidth: 650,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  programBox: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#004A99', // BBDI Deep Blue
    borderLeftStyle: 'solid',
    marginBottom: 30,
    minWidth: 400,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004A99',
    marginBottom: 4,
  },
  programSub: {
    fontSize: 12,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  signatureContainer: {
    alignItems: 'center',
    width: 200,
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#475569',
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#004A99',
  },
  signatureTitle: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  meta: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 11,
    color: '#64748b',
  },
  id: {
    fontSize: 9,
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
  const fullName = capitalizeName(certificate?.userName) || template.placeholderName;
  const moduleName = certificate?.moduleTitle || 'Módulo';
  const departmentName = certificate?.sectorTitle || 'Departamento';
  const levelName = certificate?.levelTitle || 'Básico';
  const issuedAt = certificate?.issuedAt ? formatDate(certificate.issuedAt) : formatDate(new Date());

  return (
    <Document title={`Certificado - ${fullName}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            <View style={styles.header}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoTextGrupo}>GRUPO</Text>
                <Text style={styles.logoTextBBDI}>BBDI</Text>
              </View>
              <Text style={styles.institution}>{template.institution}</Text>
            </View>

            <Text style={styles.headline}>{template.headline}</Text>
            
            <Text style={styles.name}>{fullName}</Text>
            
            <Text style={styles.statement}>
              {fillTemplate(template.statement, {
                nome: fullName,
              })}
            </Text>

            <View style={styles.programBox}>
              <Text style={styles.programTitle}>{moduleName}</Text>
              <Text style={styles.programSub}>{departmentName} • Nível {levelName}</Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.signatureContainer}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Diretoria de Treinamento</Text>
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
