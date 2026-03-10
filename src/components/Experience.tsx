"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience() {
  const experiences = [
    {
      role: "Tech Manager",
      company: "Marketdata",
      period: "Apr 2022 - Present",
      description: "Managing the development project portfolio, focusing on the design of robust solutions and complex architectures. Leading a team of 25+ collaborators to align technology with business goals. Key projects include digitizing architect relationship programs and automating CRM processes.",
      tech: ["Solution Design", "Architecture", "Leadership", "Data Strategy", "CRM"]
    },
    {
      role: "Tech Lead",
      company: "Marketdata",
      period: "May 2011 - Mar 2022",
      description: "Led the full lifecycle of structural CRM / Loyalty projects. Developed campaign engines and self-service interfaces, defining robust architectures that empowered high autonomy for business users across various tier-1 clients.",
      tech: ["Technical Leadership", "System Architecture", "Loyalty Systems", "Integration"]
    },
    {
      role: "Senior Java Fullstack Developer",
      company: "Marketdata",
      period: "Feb 2010 - Apr 2011",
      description: "Built high-performance fullstack solutions. Integrated and consumed REST/SOAP services. Optimized SQL Server queries and maintained legacy systems to improve data cleansing assertiveness.",
      tech: ["Java", "JSP", "JavaScript", "SQL Server", "REST/SOAP"]
    },
    {
      role: "Mid-level Java Fullstack Developer",
      company: "Marketdata",
      period: "Sep 2008 - Jan 2010",
      description: "Developed a campaign manager supporting DBM operations, reducing generation errors.",
      tech: ["Java", "JSP", "SQL Server", "Tomcat"]
    },
    {
      role: "Junior Java Developer",
      company: "Cardif do Brasil Seguros",
      period: "Aug 2007 - Aug 2008",
      description: "Java/JSF fullstack developer.",
      tech: ["Java", "JSF", "JSP"]
    }
  ];

  return (
    <section id="experience" className="py-24 relative bg-brand-slate/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cyan/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-brand-cyan mb-4"
          >
            <Briefcase size={24} />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Career Journey</h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-lg"
          >
            17+ years dedicated to turning complex data and requirements into high-value technological solutions.
          </motion.p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
                
                {/* Timeline Connector Desktop */}
                <div className="hidden md:flex flex-col items-end col-span-1 pt-1 opacity-70">
                  <span className="text-sm font-bold text-white mb-1">{exp.period}</span>
                  <span className="text-xs text-brand-cyan flex items-center gap-1">
                    <Calendar size={12} /> {exp.company}
                  </span>
                </div>

                {/* Timeline Dot & Line */}
                <div className="absolute left-0.5 md:left-[24.5%] top-2 bottom-0 w-px bg-brand-cyan/20"></div>
                <div className="absolute left-[-4px] md:left-[calc(25%-4px)] top-2 w-2 h-2 rounded-full bg-brand-cyan ring-4 ring-background"></div>

                {/* Content */}
                <div className="col-span-3 pb-8">
                  {/* Mobile header */}
                  <div className="md:hidden flex flex-col mb-4 bg-brand-cyan/10 p-3 rounded-lg border border-brand-cyan/20">
                    <span className="text-sm font-bold text-white mb-1">{exp.period}</span>
                    <span className="text-xs text-brand-cyan flex items-center gap-1">
                      <Calendar size={12} /> {exp.company}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-3">{exp.role}</h3>
                  <p className="text-brand-gray mb-6 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map(tech => (
                      <span key={tech} className="px-3 py-1 text-xs font-mono text-brand-cyan bg-brand-cyan/10 rounded border border-brand-cyan/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
