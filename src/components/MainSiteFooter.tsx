import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Download } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="fade-in">
            <h3 className="text-lg font-semibold mb-4">About Ankit Kachhawa</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Professional financial services provider in Deesa, Banaskantha, Gujarat. 
              We offer expert GST filing, mutual fund advisory, and comprehensive financial planning services. 
              Serving clients across Banaskantha district with reliable and trustworthy financial solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/ankit.kachhawa.7" className="text-gray-400 hover:text-[#3498db] transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/iAnkitKachhawa?t=w5B3bg89g852h7IBq7N7-g&s=09" className="text-gray-400 hover:text-[#3498db] transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com/Ankitkachhawa" className="text-gray-400 hover:text-[#3498db] transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/ankit-kachhawa-9964421a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-gray-400 hover:text-[#3498db] transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="fade-in">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={18} className="text-[#3498db] mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">ankitkachchhawa@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="text-[#3498db] mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">+91 95100 74375</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-[#3498db] mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">1st Floor, Pitrukrupa Shopping Centre, Deesa, Gujarat-385535</span>
              </li>
              <li className="mt-4">
                <a
                  href="https://ankitkachhawa.in/me.vcf"
                  download
                  className="flex items-center text-sm bg-[#3498db]/20 text-[#3498db] hover:bg-[#3498db]/30 rounded-full py-2 px-4 transition-colors w-fit"
                >
                  <Download size={16} className="mr-2" />
                  <span>Download Contact Card</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Service Areas */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-300">Service Areas in Banaskantha District</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-500">
            <span>Deesa (દીસા)</span>
            <span>Palanpur (પાલનપુર)</span>
            <span>Dhanera (ધાનેરા)</span>
            <span>Tharad (થરાદ)</span>
            <span>Vav (વાવ)</span>
            <span>Danta (દાંતા)</span>
            <span>Kankrej (કાંકરેજ)</span>
            <span>Lakhani (લાખાણી)</span>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Ankit Kachhawa Financial Services. All rights reserved.</p>
          <p className="mt-1">GST & Mutual Fund Expert in Deesa, Banaskantha, Gujarat</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
