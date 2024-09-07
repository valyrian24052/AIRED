import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styles from '../styles/Resume.module.css';

const Resume = () => {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>My Resume</title>
      </Head>

      <header className={styles.header}>
        <a href="/" className={styles.backLink} onClick={handleBack}>
          <span className={styles.arrow}>&#8592;</span> Back
        </a>
      </header>

      <main className={styles.main}>
        {/* Your resume content goes here */}
      </main>

    </div>
  );
};

export default Resume;