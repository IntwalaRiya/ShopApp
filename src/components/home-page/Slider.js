import React from "react";
// import img1 from "./../../assets/pictures/1 (1).jpg";
// import img2 from "./../../assets/pictures/1 (2).jpg";
// import img3 from "./../../assets/pictures/1 (3).jpg";
import Coverflow from "react-coverflow";

/* will change the slider styling soon */
const Slider = () => {
  const img1 = 'https://shopappimages.s3.amazonaws.com/pictures/1+(1).jpg';
  const img2 = 'https://shopappimages.s3.amazonaws.com/pictures/1+(2).jpg';
  const img3 = 'https://shopappimages.s3.amazonaws.com/pictures/1+(3).jpg'
  return (
    <div className='main-slider'>
      <Coverflow
        width={960}
        height={480}
        displayQuantityOfSide={2}
        navigation={false}
        infiniteScroll={true}
        enableScroll={false}
        enableHeading={false}>
        <img
          src={img1}
          alt='title or description'
          style={{ display: "block", width: "100%" }}
        />
        <img
          src={img2}
          alt='title or description'
          data-action='http://andyyou.github.io/react-coverflow/'
        />
        <img
          src={img3}
          alt='title or description'
          data-action='http://andyyou.github.io/react-coverflow/'
        />
        <img
          src={img1}
          alt='title or description'
          style={{ display: "block", width: "100%" }}
        />
        <img
          src={img2}
          alt='title or description'
          data-action='http://andyyou.github.io/react-coverflow/'
        />
        <img
          src={img3}
          alt='title or description'
          data-action='http://andyyou.github.io/react-coverflow/'
        />
      </Coverflow>
    </div>
  );
};

export default Slider;
