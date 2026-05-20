import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { certificateTemplates, fillTemplate } from '../../data/certificateTemplates';

const styles = StyleSheet.create({
  page: {
    padding: 16,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontFamily: 'Helvetica',
    size: 'A4 landscape',
  },
  frame: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#c8d3e3',
    borderStyle: 'solid',
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  glowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 110,
    backgroundColor: 'rgba(29, 78, 216, 0.06)',
  },
  glowCorner: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '42%',
    height: 120,
    backgroundColor: 'rgba(180, 135, 42, 0.06)',
  },
  header: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  logoTop: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: 700,
  },
  logoBrand: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: 700,
    lineHeight: 1,
  },
  badge: {
    fontSize: 11,
    color: '#1d4ed8',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  seal: {
    fontSize: 12,
    color: '#475569',
    borderWidth: 1,
    borderColor: '#c8d3e3',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    color: '#0f172a',
    marginBottom: 10,
    fontWeight: 700,
  },
  name: {
    fontSize: 34,
    color: '#10203a',
    marginBottom: 10,
    fontWeight: 700,
  },
  statement: {
    fontSize: 12.5,
    lineHeight: 1.45,
    color: '#475569',
    maxWidth: 680,
  },
  highlightRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 16,
  },
  highlightBox: {
    minWidth: 150,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d6dfe9',
  },
  highlightLabel: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  highlightValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 700,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
  },
  signature: {
    minWidth: 220,
  },
  signatureLine: {
    height: 1,
    backgroundColor: '#1d4ed8',
    marginBottom: 10,
  },
  signatureTitle: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 700,
  },
  signatureSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  meta: {
    alignItems: 'flex-end',
  },
  metaTitle: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 11,
    color: '#0f172a',
    marginTop: 6,
  },
  footerNote: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 8,
  },
});

const formatDate = (date) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(date));

const MarketingCertificateDocument = ({ certificate }) => {
  const template = certificateTemplates.marketingProducts;
  const fullName = certificate?.userName?.trim() || template.placeholderName;
  const programName = certificate?.trainingTrailName || certificate?.sectorTitle || template.programTitle;
  const issuedAt = certificate?.issuedAt ? formatDate(certificate.issuedAt) : '';

  return (
    <Document title={`Certificado - ${fullName}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.frame}>
          <View style={styles.glowTop} />
          <View style={styles.glowCorner} />

          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoTop}>Grupo</Text>
              <Text style={styles.logoBrand}>BBDI</Text>
            </View>
            <Text style={styles.seal}>Certificado de Conclusão</Text>
          </View>

          <View style={styles.center}>
            <Text style={styles.title}>{template.headline}</Text>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.statement}>
              {fillTemplate(template.statement, {
                nome: fullName,
                programa: programName,
              })}
            </Text>

            <View style={styles.highlightRow}>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightLabel}>Trilha concluída</Text>
              <Text style={styles.highlightValue}>{programName}</Text>
            </View>
            <View style={styles.highlightBox}>
                <Text style={styles.highlightLabel}>Aproveitamento</Text>
                <Text style={styles.highlightValue}>{certificate?.percent ?? 0}%</Text>
              </View>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightLabel}>Resultado</Text>
                <Text style={styles.highlightValue}>
                  {certificate?.score ?? 0}/{certificate?.totalQuestions ?? 0} acertos
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureTitle}>Coordenação de Treinamentos</Text>
              <Text style={styles.signatureSub}>{template.institution}</Text>
            </View>

            <View style={styles.meta}>
              <Text style={styles.metaTitle}>Emitido em</Text>
              <Text style={styles.metaValue}>{issuedAt}</Text>
              <Text style={styles.footerNote}>{template.footerNote}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MarketingCertificateDocument;
