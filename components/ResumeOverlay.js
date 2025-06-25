import React from 'react';
import styles from '../styles/ResumeOverlay.module.css';

const experiences = [
    {
      company: "Mrikal Studios",
      role: "Data Engineer",
      duration: "Jun 2024 - Present · 4 mos",
      location: "Gurugram, Haryana, India · On-site",
      details: [
        "Developed Multi-Agent System for Voice-Based Flight Booking: Engineered a sophisticated multi-agent architecture with inter-agent control flow and natural language processing capabilities to enable a seamless voice-based flight booking experience.",
        "Built Real-Time Project Health Monitoring Dashboard: Designed and implemented a real-time project health monitoring dashboard leveraging SDLC data and predictive analytics to proactively identify potential bottlenecks and mitigate risks, ensuring on-time project delivery.",
        "Automated Unstructured Data Migration to Structured Warehouse: Developed a robust automated migration solution with intelligent mapping and transformation capabilities, efficiently transferring unstructured NoSQL data into a structured data warehouse format, facilitating faster and more comprehensive analysis."
      ]
    },
    {
      company: "Megaminds IT Services",
      role: "Machine Learning Engineer intern",
      duration: "Sep 2023 - Jun 2024 · 10 mos",
      location: "Remote",
      details: [
        "Leveraged Natural Language Processing (NLP) techniques, including BERT and semantic similarity, to design and implement a course recommendation system. This system analyzes student profiles and historical exam data to predict optimal course selections for upcoming semesters, thereby improving student academic success.",
        "Developed and implemented a machine learning-based intrusion detection system (IDS) for Controller Area Network (CAN) and Autonomous Vehicle (AV) networks. This IDS proactively identifies vulnerabilities and potential attacks, ensuring the security and integrity of critical network infrastructure.",
        "Conducted in-depth research on various model architecture methodologies to support diverse research projects. Successfully optimized machine learning models to achieve specific research objectives, demonstrating a comprehensive understanding of machine learning principles."
      ]
    },
    {
      company: "ShopUp",
      role: "Business Finance Intern",
      duration: "Apr 2023 - Aug 2023 · 5 mos",
      location: "Bangalore, India · Hybrid",
      details: [
        "Optimized revenue generation by developing and implementing standardized pricing SOPs across multiple business units. Partnered with the growth team to manage client negotiations, securing a 5% revenue increase.",
        "Streamlined MIS reporting by crafting concise summaries of revenue waterfalls and cost insights. These summaries provided stakeholders with critical financial intelligence to drive strategic decision-making.",
        "Led the development and deployment of comprehensive dashboards for load forecasting, unit-level cost analysis, and profitability analysis. These dashboards empowered stakeholders with granular financial insights, enabling them to optimize business performance."
      ]
    },
    {
      company: "Echo",
      role: "Machine Learning Engineer intern",
      duration: "Feb 2023 - Apr 2023 · 3 mos",
      location: "Mumbai, Maharashtra, India · Hybrid",
      details: [
        "Led the design and implementation of an innovative architecture for fine-tuning OpenAI LLMs on company-specific product reviews. This engine generates statistically robust, actionable insights when prompted, empowering product managers to optimize product offerings for targeted user segments.",
        "Spearheaded the development of a scalable cloud-based infrastructure for product review analysis. The platform facilitates user submission of CSV files containing reviews and leverages a hosted LLM to extract valuable insights, driving continuous product improvement.",
        "Developed and optimized a machine learning classification model for automatic review annotation, achieving a 90% reduction in manual annotation time. This innovation streamlines the review process, unlocking valuable insights from product reviews with increased efficiency."
      ]
    },
    {
      company: "Ignitus",
      role: "Machine Learning Researcher intern",
      duration: "Sep 2022 - Jan 2023 · 5 mos",
      location: "Remote",
      details: [
        "Implemented AWS infrastructures such as SageMaker and EC2 to establish a collaborative workspace for the team and facilitate model training.",
        "Contributed to the training of a Deep Learning model, resulting in the development of a chatbot designed to provide career advisory services for students."
      ]
    },
    {
      company: "Mtab Technologies",
      role: "Data Analyst Intern",
      duration: "Aug 2022 - Oct 2022 · 3 mos",
      location: "Remote",
      details: [
        "Assumed the pivotal role of being the primary liaison for client service teams across a spectrum of diverse projects, ensuring effective communication and collaboration.",
        "Executed comprehensive data validation procedures on information acquired from various suppliers, employing meticulous scrutiny to guarantee the accuracy and reliability of the data for further analysis and decision-making processes."
      ]
    }
  ];

const ResumeOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h1 className={styles.title}>Professional Experience</h1>
        <div className={styles.resumeContainer}>
          <div className={styles.experienceTree}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.experienceNode}>
                <div className={styles.experienceContent}>
                  <div className={styles.header}>
                    <div className={styles.companyName}>{exp.company}</div>
                    <div className={styles.duration}>{exp.duration}</div>
                  </div>
                  <div className={styles.role}>{exp.role}</div>
                  <div className={styles.location}>{exp.location}</div>
                  <div className={styles.details}>
                    {exp.details.map((detail, i) => (
                      <div key={i} className={styles.bullet}>{detail}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOverlay;