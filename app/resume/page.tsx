import { SectionHeading } from "components/section-heading";

export default function Page() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <header className="border-b border-slate-300 dark:border-slate-800 pb-6">
          <SectionHeading title="Resume" />
          <p className="mt-4 text-sm sm:text-base">
            Software Engineer with over 15 years of experience building scalable web applications and integration platforms. Specialized in
            TypeScript (JS, React), with solid expertise in APIs, integrations, and healthcare standards (HL7). Proven ability to lead teams
            and mentor engineers, turning complex requirements into simple and secure solutions.
          </p>
          <p className="mt-3 text-sm sm:text-base">
            Successfully implemented unit testing and CI/CD pipelines for Mirth Connect, increasing reliability and delivery speed in a
            mission-critical healthcare integration layer.
          </p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Languages: Portuguese (native), English (fluent, professional working proficiency), Spanish (limited working proficiency)
          </p>
        </header>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Skills</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Languages & Tools</h3>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <li>TypeScript / JavaScript (10+ years) – Node.js, React, Angular</li>
                <li>Java (10+ years)</li>
                <li>SQL (10+ years)</li>
                <li>HL7 (4 years)</li>
                <li>Python (5 years)</li>
                <li>Tailwind CSS (5 years)</li>
                <li>HTML5 (10+ years)</li>
                <li>CSS (10+ years)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">Technologies & Platforms</h3>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <li>Databases: MySQL, Postgres, Oracle</li>
                <li>Integration Engine: Mirth Connect</li>
                <li>NoSQL: MongoDB, Firebase</li>
                <li>Frameworks: Spring Boot, Hibernate, Angular, React</li>
                <li>ETL & Analytics tooling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Work Experience - Timeline */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Work Experience</h2>

          <div className="space-y-10">
            {/* SOAP Health */}
            <article className="relative">
              <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">SOAP Health, Inc.</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Remote – Full-time (Florida, USA) – Since Aug 2021</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Healthtech leveraging AI & clinical data</p>
                </div>

                <p className="mt-3 text-sm">
                  A healthtech company leveraging AI and advanced clinical data to improve patient outcomes, helping providers deliver more
                  accurate, efficient, and personalized care.
                </p>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Skills: Leadership, TypeScript, Node.js, API Development, React.js, SQL, Mirth Connect, HL7 FHIR (Healthcare Standards)
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Integration Tech Lead – Since Aug 2023</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                      <li>
                        Lead the integration team, designing and delivering scalable solutions that connect healthcare systems and
                        enterprise platforms.
                      </li>
                      <li>
                        Drive development best practices with a focus on APIs, interoperability, and data exchange across complex
                        environments.
                      </li>
                      <li>Mentor and guide engineers, fostering clarity, pragmatism, and measurable outcomes.</li>
                      <li>
                        Implemented unit testing and CI/CD pipelines for Mirth Connect, improving reliability, quality, and delivery speed
                        in a mission-critical integration layer.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Senior Software Developer – Aug 2021 – Aug 2023 (2 yrs)</h4>
                    <ul className="mt-1 list-disc list-inside text-sm text-slate-700 dark:text-slate-300  space-y-1">
                      <li>
                        Developed and maintained enterprise-grade applications with a strong focus on backend services and system
                        integrations.
                      </li>
                      <li>Collaborated closely with cross-functional teams to ensure scalable, secure, and business-driven solutions.</li>
                      <li>
                        Quickly adapted to HL7 and Mirth Connect, establishing integration patterns and best development practices to ensure
                        quality and consistency.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            {/* CF Inova Tech */}
            <article className="relative">
              <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">CF Inova Tech</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Remote – Full-time (CE, Brazil) – 2 yrs and 10 mos</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Software company focused on web, mobile & business solutions
                  </p>
                </div>

                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                  A software company focused on web, mobile, and business solutions, delivering innovation through technology.
                </p>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Skills: TypeScript, API Development, Java, Spring Boot, Hibernate, ETL, Angular, React.js, SQL (PL/SQL, Oracle, MySQL,
                  Postgres), NoSQL (MongoDB, Firebase)
                </p>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Senior Software Engineer – Oct 2018 – Aug 2021 (2 yrs and 10 mos)</h4>
                  <ul className="mt-1 list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                    <li>Designed and developed fullstack applications and APIs, ensuring performance, reliability, and maintainability.</li>
                    <li>Collaborated with cross-functional teams to align technical solutions with business requirements.</li>
                    <li>
                      Contributed to code quality improvements by promoting standards, peer reviews, and maintainable development practices.
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* M. Dias Branco */}
            <article className="relative">
              <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold">M. Dias Branco</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Full-time (CE, Brazil) – 10 yrs and 5 mos</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Largest food company in Brazil, strong presence in LATAM
                  </p>
                </div>

                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                  The largest food company in Brazil and a leading producer of pasta, cookies, crackers, and flour in Latin America, with
                  over 20,000 employees and presence in more than 40 countries.
                </p>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Skills: TypeScript, API Development, Java, Spring Boot, Hibernate, ETL, Oracle, Angular, React.js, SQL
                </p>

                <div className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <div>
                    <h4 className="text-sm font-semibold">Senior Software Engineer – Jun 2012 – Oct 2018 (6 yrs and 5 mos)</h4>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>
                        Developed and maintained fullstack enterprise applications, combining Oracle (PL/SQL) backend with modern frontend
                        solutions.
                      </li>
                      <li>
                        Delivered business-critical features with high reliability, ensuring compliance and scalability in complex
                        environments.
                      </li>
                      <li>
                        Key contributor to the Profit-Sharing (PL) payment project, handling intricate business rules in a payroll system
                        serving over 20,000 employees.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Mid-level Software Developer – Oct 2010 – Jun 2012 (1 yr and 8 mos)</h4>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>
                        Contributed to the development and maintenance of enterprise applications, supporting both backend and frontend
                        demands.
                      </li>
                      <li>
                        Actively participated in key company projects, delivering features that directly supported business growth and
                        operations.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Junior Software Developer – Apr 2009 – Oct 2010 (1 yr and 6 mos)</h4>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>
                        Supported the development and maintenance of internal systems while learning best practices in software engineering.
                      </li>
                      <li>
                        Contributed to core company projects, gaining early experience in delivering real business value through technology.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Software Developer Intern – Apr 2008 – Apr 2009 (1 yr)</h4>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>
                        Assisted in the development and maintenance of applications, gaining hands-on experience with real-world projects.
                      </li>
                      <li>
                        Earned an early promotion to a full-time developer role, recognized for strong performance and contribution to the
                        team.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Education</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
              <h3 className="font-semibold text-sm sm:text-base">Estácio University</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <li>MBA in Artificial Intelligence – 2025 – In progress</li>
                <li>BSc in Computer Science – 2020 – 2024</li>
                <li>PGDip, Big Data, Business Intelligence and Analytics Applied to Business – 2021 – 2024</li>
                <li>AS, Systems Analysis and Development – 2015 – 2017</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Licenses & Certifications */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Licenses & Certifications</h2>
          <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li>Oracle Certified Professional, Java SE 6 Programmer – 2011 (Oracle)</li>
              <li>DevOps Essentials – 2020 (4linux)</li>
              <li>Android Oreo and Nougat App Masterclass – 2017 (Udemy)</li>
              <li>Spring Framework Masterclass – Beginner to Expert – 2017 (Udemy)</li>
              <li>Oracle SOA Suite 11g: Essential Concepts Ed 2 PRV – 2014 (Oracle)</li>
              <li>Oracle WebLogic Server 11g: Monitor and Tune Performance Ed 2 – 2014 (Oracle)</li>
              <li>Oracle WebLogic Server 11g: Administration Essentials Ed 2 PRV – 2014 (Oracle)</li>
              <li>Oracle Fusion Middleware 11g: Build Applications with ADF Accelerated Ed 2 PRV – 2014 (Oracle)</li>
              <li>Oracle Forms & Reports 6i – 2009 (SensusX ERP)</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
