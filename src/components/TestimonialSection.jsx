import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Ramesh Patil",
    role: "Farmer from Maharashtra",
    message:
      "BeejSeBazaar completely transformed how I choose crops and sell them. I can now make decisions confidently based on real data.",
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b2?w=100&q=80",
  },
  {
    name: "Sita Devi",
    role: "Farmer from Bihar",
    message:
      "Disease detection has never been easier. Just a photo and I get solutions instantly. This tech is a game changer!",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  },
  {
    name: "Harbhajan Singh",
    role: "Farmer from Punjab",
    message:
      "Earlier, I relied on local traders. Now I get better prices by checking the real-time market data from BeejSeBazaar.",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Farmers Are Saying
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from real users who’ve boosted their farming with BeejSeBazaar.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="max-w-3xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-md text-center transition-all duration-300 hover:shadow-xl">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover mb-4"
                />
                <p className="text-gray-700 text-lg mb-4 italic">
                  “{testimonial.message}”
                </p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;
