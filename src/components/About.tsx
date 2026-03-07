"use client";

import { motion } from "framer-motion";
import { Code2, Server, Users, Lightbulb } from "lucide-react";

export default function About() {
  const skills = [
    {
      icon: <Users className="text-brand-cyan mb-4" size={32} />,
      title: "People Leadership",
      description: "Fostering collaborative environments, stimulating creativity, innovation, and continuous development of professionals."
    },
    {
      icon: <Server className="text-brand-cyan mb-4" size={32} />,
      title: "Systems Architecture",
      description: "Transforming business requirements into robust solutions that effectively add value to the business and scale."
    },
    {
      icon: <Code2 className="text-brand-cyan mb-4" size={32} />,
      title: "Fullstack Development",
      description: "Deep expertise in technologies like Java, Python, SQL, Databricks, Javascript, AWS, and Microservices."
    },
    {
      icon: <Lightbulb className="text-brand-cyan mb-4" size={32} />,
      title: "Agile & Product Management",
      description: "Adapting the most efficient methodology (Waterfall to Scrum) ensuring transparency and adequate communication."
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Driving Innovation at the Intersection of <span className="text-brand-cyan">Data</span> & <span className="text-brand-cyan">Strategy</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-gray text-lg"
          >
            With over 13 years of leadership experience in large-scale projects across banking, insurance, and retail sectors, I specialize in creating solutions that connect brands and customers in meaningful, personalized ways.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-2xl border border-white/5 hover:border-brand-cyan/30 transition-all duration-300 group"
            >
              <div className="transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300">
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">{skill.title}</h3>
              <p className="text-brand-gray/80 text-sm leading-relaxed">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
