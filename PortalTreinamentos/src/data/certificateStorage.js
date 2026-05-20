import { createId, readStorageJSON, writeStorageJSON } from './runtime';

const CERTIFICATES_STORAGE_KEY = 'portalTreinamentos.certificates';

const readCertificates = () => {
  const storedCertificates = readStorageJSON(CERTIFICATES_STORAGE_KEY, []);

  return Array.isArray(storedCertificates) ? storedCertificates : [];
};

const writeCertificates = (certificates) => {
  writeStorageJSON(CERTIFICATES_STORAGE_KEY, certificates);
};

export const recordCertificate = ({
  user,
  moduleId,
  moduleTitle,
  sectorTitle,
  trainingTrailName,
  programKey,
  levelId,
  levelTitle,
  quizTitle,
  score,
  totalQuestions,
  percent,
}) => {
  if (!user) return null;

  const certificate = {
    id: createId('cert'),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    moduleId: String(moduleId),
    moduleTitle,
    sectorTitle,
    trainingTrailName: trainingTrailName ?? sectorTitle ?? moduleTitle ?? '',
    programKey,
    levelId,
    levelTitle,
    quizTitle,
    score,
    totalQuestions,
    percent,
    issuedAt: new Date().toISOString(),
  };

  const existingCertificates = readCertificates();
  const nextCertificates = programKey
    ? [
        ...existingCertificates.filter(
          (item) => !(item.userId === certificate.userId && item.programKey === programKey),
        ),
        certificate,
      ]
    : [...existingCertificates, certificate];

  writeCertificates(nextCertificates);
  return certificate;
};

export const getLatestCertificateByUser = (userId) => {
  const certificates = readCertificates().filter((certificate) => certificate.userId === userId);

  return certificates.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))[0] ?? null;
};
