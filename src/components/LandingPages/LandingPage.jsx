import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
 
import LandingPageIntro from "./LandingPageIntro";

import LandingPageIntro1 from "./LandingPageIntro1";
import LandingPageIntro2 from "./LandingPageIntro2";
import LandingPageIntro3 from "./LandingPageIntro3";
import Footer from "./Footer";
import NavBar from "./Navbar";
 

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>IMPS GURU</title>
        <meta name="description" content="IMPS GURU - Secure Payment Platform" />
        <meta name="keywords" content="TrustPayIndia, Payments, Finance" />
      </Helmet>

      {/* Navbar */}
      <NavBar />
  

      {/* Landing Page Sections */}
      <div className="app-content">
        <LandingPageIntro />
        <LandingPageIntro1 />
        <LandingPageIntro2  />
        <LandingPageIntro3 />


        {/* footer */}
            <Footer />

      </div>
    </div>
  );
};

export default LandingPage;
