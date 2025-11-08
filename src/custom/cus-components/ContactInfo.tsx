'use client'


// components/ContactInfo.tsx
import { FaMapMarkedAlt, FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

export default function ContactInfo() {
  return (
    <section className="bg-[#fdf4ec] text-[#2b2e4a] py-16 md:py-36 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {/* Standort */}
        <div>
          <FaMapMarkedAlt className="w-8 h-8 mx-auto mb-4 text-[#2b2e4a]" />
          <h3 className="uppercase text-sm tracking-wider font-semibold mb-2">Location</h3>
          
          <p className="text-sm">82-84 Standard Avenue.</p>
            <p className="text-sm">Coventry ,</p>
            <p className="text-sm">United Kingdom</p>
        </div>

        {/* Telefon */}
        <div>
          <FaPhoneAlt className="w-8 h-8 mx-auto mb-4 text-[#2b2e4a]" />
          <h3 className="uppercase text-sm tracking-wider font-semibold mb-2">Phone</h3>
          <p className="text-sm"> +44 7777 369496</p>
        </div>

        {/* E-Mail */}
        <div>
          <FaEnvelope className="w-8 h-8 mx-auto mb-4 text-[#2b2e4a]" />
          <h3 className="uppercase text-sm tracking-wider font-semibold mb-2">E-Mail</h3>
          <a href="mailto:info@lakeside-ellerau.de" className="text-sm hover:underline">
            info@anjanabhog.com
          </a>
        </div>

        {/* Öffnungszeiten */}
         <div>
          <FaCalendarAlt className="w-8 h-8 mx-auto mb-4 text-[#2b2e4a]" />
        <h3 className="uppercase text-sm tracking-wider font-semibold mb-2">Opening Hours</h3>
<div className="text-sm space-y-1">
  <p>Six day weak</p>
  {/* <p>Sunday: Closed</p>
  <p>Tuesday to Friday:<br />12 PM to 10 PM</p>
  <p>Saturday: 4 PM – 10 PM</p>
  <p>Sunday: 12 PM – 9 PM</p> */}
</div>
        </div>
      </div>
    </section>
  );
}
