import React from 'react';
import './TitleAnimation.scss'; // Updated SCSS for styling

const TitleAnimation: React.FC = () => {
  return (
    <div className="title-animation-wrapper">
      <h1 className="neon-text" data-text="Seekers of the Harvest">
        Seekers of the Harvest
      </h1>
    </div>
  );
};

export default TitleAnimation;
