import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Type } from "i18n/locales/type";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 38, fontSize: 10, color: "#172033", fontFamily: "Helvetica" },
  name: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#0f4c5c" },
  role: { fontSize: 12, color: "#217a8b", marginTop: 5, marginBottom: 5 },
  contact: { color: "#526075", marginBottom: 4 },
  highlights: { color: "#526075", marginBottom: 11 },
  section: { marginTop: 15 },
  heading: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#0f4c5c", marginBottom: 7, textTransform: "uppercase" },
  subheading: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#34445a", marginTop: 4, marginBottom: 4 },
  text: { lineHeight: 1.45, marginBottom: 5 },
  muted: { color: "#526075", marginBottom: 5 },
  job: { borderLeftWidth: 2, borderLeftColor: "#3ab5c4", paddingLeft: 9, marginBottom: 12 },
  jobTitle: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  bullet: { marginLeft: 8, marginBottom: 2, lineHeight: 1.4 },
});

export function ResumePdf({ resume }: { resume: Type["resume"] }) {
  return (
    <Document title={`${resume.subtitle} - ${resume.title}`} author="Caio Frota">
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{resume.subtitle}</Text>
        <Text style={styles.role}>{resume.role}</Text>
        <Text style={styles.contact}>{resume.contactLine}</Text>
        <Text style={styles.highlights}>{resume.highlights.map((highlight) => `${highlight.value} — ${highlight.label}`).join(" · ")}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>{resume.profileLabel}</Text>
          {resume.sections.header.descriptions.map((description) => (
            <Text key={description} style={styles.text}>
              {description}
            </Text>
          ))}
          <Text style={styles.subheading}>{resume.sections.header.languages.title}</Text>
          <Text style={styles.muted}>{resume.sections.header.languages.list.join(" · ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{resume.sections.skills.title}</Text>
          <Text style={styles.subheading}>{resume.sections.skills.languages.title}</Text>
          <Text style={styles.text}>{resume.sections.skills.languages.list.join(" · ")}</Text>
          <Text style={styles.subheading}>{resume.sections.skills.technologiesAndPlatforms.title}</Text>
          <Text style={styles.text}>{resume.sections.skills.technologiesAndPlatforms.list.join(" · ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{resume.sections.experience.title}</Text>
          {resume.sections.experience.jobs.map((job) => (
            <View key={job.company} style={styles.job}>
              <Text style={styles.jobTitle}>
                {job.company} — {job.period}
              </Text>
              <Text style={styles.muted}>{job.location}</Text>
              <Text style={styles.text}>{job.description}</Text>
              {job.positions.map((position) => (
                <View key={`${position.title}-${position.period}`}>
                  <Text style={styles.jobTitle}>
                    {position.title} — {position.period}
                  </Text>
                  {position.responsibilities.map((item) => (
                    <Text key={item} style={styles.bullet}>
                      • {item}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{resume.sections.education.title}</Text>
          {resume.sections.education.institutions.map((institution) => (
            <Text key={institution.name} style={styles.text}>
              {institution.name}: {institution.qualifications.join(" · ")}
            </Text>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.heading}>{resume.sections.certifications.title}</Text>
          {resume.sections.certifications.qualifications.map((certification) => (
            <Text key={certification} style={styles.bullet}>
              • {certification}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
