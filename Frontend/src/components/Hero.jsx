import React, { useState, useEffect } from "react";

const Hero = () => {
  const images = [
    "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhbXB1cyUyMGV2ZW50fGVufDB8fDB8fHwy",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNhbXB1cyUyMGV2ZW50fGVufDB8fDB8fHwy",
    "https://images.unsplash.com/photo-1484494789010-20fc1a011197?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhbXB1cyUyMGV2ZW50fGVufDB8fDB8fHwy",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
  <div className="w-full h-60 bg-cover bg-center flex" style={{ backgroundImage: `url(${images[currentImage]})`, transition: 'background-image 0.5s ease-in-out' }}>
    <div className="p-6 flex justify-between items-center content-center bg--500">
      <div className="">
        <h1 className="text-4xl font-bold text-blue-800">
          Experience World-Class Learning at a Premier Institute
        </h1>
        <p className="mt-2 text-white">Approved by the Ministry of Education with UGC Recognition</p>
      </div>
      </div>
    </div>
  );
};

export default Hero;
