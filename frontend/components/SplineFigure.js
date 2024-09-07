import React from 'react';
import styles from '../styles/SplineFigure.module.css';

const SplineFigure = () => {
    
  console.log('SplineFigure component rendered');
  return (
    <div className={styles.splineContainer}>
      <iframe
        src='https://my.spline.design/rocket-7a86a999a1a300f63c20ef5b2cd56a27/'
        frameBorder='0'
        width='100%'
        height='100%'
        title="Rocket Spline Figure"
      />
    </div>
  );
};

export default SplineFigure;