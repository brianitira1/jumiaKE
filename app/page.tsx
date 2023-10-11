import React from "react";
import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import HeroCarousel from "@/components/HeroCarousel";

const Home = () => {
  return (
    <>
      <section className="px-6  md:px-20 py-24">
        <div
          className="flex flex-col md:flex-row justify-between max-xl: flex-col"
          gap-16
        >
          <div className="flex flex-col justify-center">
            <p className="small-text">
              hey i got you, go low as you want
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Get the best from our <br></br>
              <span className="text-primary"> Application</span>
            </h1>
            <p className="mt-6">
              this application was built to help you cruise the online market
              places like a <br></br> <span>beast</span>
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">Popping</h2>

      </section>
    </>
  );
};

export default Home;
