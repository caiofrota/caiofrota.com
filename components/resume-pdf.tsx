import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Type } from "i18n/locales/type";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 8.8, color: "#172033", fontFamily: "Helvetica" },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#0f4c5c" },
  role: { fontSize: 11, color: "#217a8b", marginTop: 3, marginBottom: 4 },
  contact: { color: "#526075" },
  section: { marginTop: 8 },
  heading: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#0f4c5c", marginBottom: 4, textTransform: "uppercase" },
  text: { lineHeight: 1.3, marginBottom: 3 },
  skillLine: { lineHeight: 1.25, marginBottom: 2 },
  label: { fontFamily: "Helvetica-Bold", color: "#34445a" },
  roleBlock: { marginBottom: 6 },
  roleTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.8, color: "#172033" },
  company: { fontFamily: "Helvetica-Bold", marginTop: 1 },
  muted: { color: "#526075", marginBottom: 2 },
  bullet: { marginLeft: 8, marginBottom: 1.3, lineHeight: 1.28 },
});

type Resume = Type["resume"];
type ResumeJob = Resume["sections"]["experience"]["jobs"][number];

function ExperienceSection({ title, jobs }: { title: string; jobs: ResumeJob[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading} minPresenceAhead={60}>
        {title}
      </Text>
      {jobs.flatMap((job) =>
        job.positions.map((position) => (
          <View key={`${job.company}-${position.title}-${position.period}`} style={styles.roleBlock} wrap={false}>
            <Text style={styles.roleTitle}>{position.title}</Text>
            <Text style={styles.muted}>
              <Text style={styles.label}>{job.company}</Text> | {job.location} | {position.period}
            </Text>
            {position.responsibilities.map((item) => (
              <Text key={item} style={styles.bullet}>
                • {item}
              </Text>
            ))}
          </View>
        )),
      )}
    </View>
  );
}

export function ResumePdf({ resume }: { resume: Type["resume"] }) {
  return (
    <Document title={`${resume.subtitle} - ${resume.title}`} author="Caio Frota" subject={resume.metadataDescription}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{resume.subtitle}</Text>
        <Text style={styles.role}>{resume.role}</Text>
        <Text style={styles.contact}>{resume.contactLine}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>{resume.profileLabel}</Text>
          {resume.sections.header.descriptions.map((description) => (
            <Text key={description} style={styles.text}>
              {description}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{resume.sections.skills.title}</Text>
          {resume.sections.skills.groups.map((group) => (
            <Text key={group.title} style={styles.skillLine}>
              <Text style={styles.label}>{group.title}: </Text>
              {group.list.join(", ")}
            </Text>
          ))}
        </View>

        <ExperienceSection title={resume.sections.experience.title} jobs={resume.sections.experience.jobs} />

        <ExperienceSection title={resume.sections.experience.additionalTitle} jobs={resume.sections.experience.additionalJobs} />

        <View style={styles.section} wrap={false}>
          <Text style={styles.heading}>{resume.sections.education.title}</Text>
          {resume.sections.education.institutions.map((institution) => (
            <View key={institution.name}>
              <Text style={styles.company}>{institution.name}</Text>
              {institution.qualifications.map((qualification) => (
                <Text key={qualification} style={styles.bullet}>
                  • {qualification}
                </Text>
              ))}
            </View>
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

        <View style={styles.section} wrap={false}>
          <Text style={styles.skillLine}>
            <Text style={styles.label}>{resume.sections.languages.title.toUpperCase()}: </Text>
            {resume.sections.languages.list.join(" | ")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
