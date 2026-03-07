"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

export default function Portfolio() {
  const projects = [
    {
      title: "Data Cleansing Engine Modernization",
      type: "Architecture & Backend",
      description: "Restructured the legacy data cleansing application, optimizing SQL Server and MySQL queries, reducing response times from seconds to single-digit milliseconds.",
      tags: ["SQL Server", "MySQL", "Java", "Performance Tuning"],
      link: "#"
    },
    {
      title: "Self-Service Campaign Manager",
      type: "Product Development",
      description: "Designed and implemented a no-code campaign manager empowering non-technical users to build robust CRM campaigns autonomously.",
      tags: ["No-Code", "UX/UI", "CRM", "Fullstack"],
      link: "#"
    },
    {
      title: "Enterprise Loyalty System Integration",
      type: "System Integration",
      description: "Led the development of a high-complexity loyalty program supporting thousands of users, integrating real-time sales data and supplier APIs.",
      tags: ["Microservices", "REST/SOAP API", "AWS", "Big Data"],
      link: "#"
    }
  ];

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-16 md:flex justify-between items-end">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4"
            >
              Featured <span className="text-brand-cyan">Projects</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-brand-gray text-lg"
            >
              A selection of structural solutions and architectures I've guided from conception to deployment.
            </motion.p>
          </div>
          
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://github.com/jrenato-o" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 text-brand-cyan hover:text-white transition-colors mt-4 md:mt-0"
          >
            <span>View GitHub</span>
            <Github size={18} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative glass p-8 rounded-2xl border border-white/5 hover:border-brand-cyan/50 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/0 via-brand-cyan/0 to-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="text-xs font-mono font-bold text-brand-cyan tracking-wider uppercase">
                  {project.type}
                </span>
                <a href={project.link} className="text-brand-gray hover:text-brand-cyan transition-colors transform hover:-translate-y-1 hover:translate-x-1 duration-300">
                  <ExternalLink size={20} />
                </a>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 font-display group-hover:text-brand-cyan transition-colors duration-300 relative z-10">
                {project.title}
              </h3>
              
              <p className="text-brand-gray text-sm leading-relaxed mb-8 flex-grow relative z-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-brand-gray/80 px-2 py-1 bg-white/5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a href="https://github.com/jrenato-o" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center space-x-2 text-brand-cyan hover:text-white transition-colors py-4 font-semibold">
            <span>View more on GitHub</span>
            <Github size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}
