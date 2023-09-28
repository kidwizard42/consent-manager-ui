import React, { useState } from 'react';
import { TrackingPurposeDetails } from 'src/@types/airgap.js';

interface sliderProps {
  checked: boolean | undefined;
  nonEssentialPurposeType: TrackingPurposeDetails;
  src: string;
  alt: string;
}

// deny all and accept all don't work with slider

const Slider: React.FC<sliderProps> = (props) => {
  const { checked, nonEssentialPurposeType, src, alt } = props;
  const [c, setC] = useState(checked);
  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          checked={c}
          onChange={(e) => {
            setC(!c);
            console.log('From slider component hehe');
          }}
        ></input>
        <span className="slider round"></span>
      </label>
      <span className="sliderText">
        {nonEssentialPurposeType?.name}{' '}
        <div className="tooltip">
          <img src={src} alt={alt} />
          <span className="tooltipText">
            {nonEssentialPurposeType?.description}
          </span>
        </div>
      </span>
    </>
  );
};

export default Slider;
