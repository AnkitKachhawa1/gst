import React from 'react';
import Link from 'next/link';

const Header = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/ankit.kachhawa.7',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/Ankitkachhawa',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.012.388a6.5 6.5 0 0 0-2.346 1.267c-.905.745-1.568 1.644-1.943 2.669C.344 5.192.224 5.793.157 6.739.123 7.686.11 8.094.11 11.715s.013 4.029.048 4.976c.034.947.156 1.548.34 2.016a6.5 6.5 0 0 0 1.267 2.346c.745.905 1.644 1.568 2.669 1.943.468.184 1.069.304 2.015.34.947.035 1.355.048 4.976.048s4.029-.013 4.976-.048c.947-.034 1.548-.156 2.016-.34a6.5 6.5 0 0 0 2.346-1.267c.905-.745 1.568-1.644 1.943-2.669.184-.468.304-1.069.34-2.015.035-.947.048-1.355.048-4.976s-.013-4.029-.048-4.976c-.034-.947-.156-1.548-.34-2.016a6.5 6.5 0 0 0-1.267-2.346C20.744 1.347 19.845.684 18.82.309 18.352.125 17.751.005 16.805-.029 15.858-.064 15.45-.077 11.829-.077s-4.029.013-4.976.048zm-.188 21.511c-3.297 0-3.684-.014-4.97-.048-.784-.034-1.312-.142-1.718-.295a2.9 2.9 0 0 1-1.08-.703 2.9 2.9 0 0 1-.703-1.08c-.153-.406-.261-.934-.295-1.718-.034-1.286-.048-1.673-.048-4.97s.014-3.684.048-4.97c.034-.784.142-1.312.295-1.718a2.9 2.9 0 0 1 .703-1.08 2.9 2.9 0 0 1 1.08-.703c.406-.153.934-.261 1.718-.295 1.286-.034 1.673-.048 4.97-.048s3.684.014 4.97.048c.784.034 1.312.142 1.718.295a2.9 2.9 0 0 1 1.08.703c.31.31.564.68.703 1.08.153.406.261.934.295 1.718.034 1.286.048 1.673.048 4.97s-.014 3.684-.048 4.97c-.034.784-.142 1.312-.295 1.718a2.9 2.9 0 0 1-.703 1.08 2.9 2.9 0 0 1-1.08.703c-.406.153-.934.261-1.718.295-1.286.034-1.673.048-4.97.048zm0-5.838c-2.708 0-4.9-2.192-4.9-4.9 0-2.708 2.192-4.9 4.9-4.9 2.708 0 4.9 2.192 4.9 4.9 0 2.708-2.192 4.9-4.9 4.9zm0-12.814c-4.36 0-7.914 3.554-7.914 7.914s3.554 7.914 7.914 7.914 7.914-3.554 7.914-7.914-3.554-7.914-7.914-7.914zm15.507-2.227c-1.018 0-1.843.825-1.843 1.843s.825 1.843 1.843 1.843 1.843-.825 1.843-1.843-.825-1.843-1.843-1.843z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/iAnkitKachhawa',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/ankit-kachhawa-9964421a2',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/919510074375',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
    },
    {
      name: 'Call',
      url: 'tel:+919510074375',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-cover bg-center shadow-lg bg-[#3498db] h-[180px]">
        {/* We use a solid color fallback if the background image fails, but you should add header-bg.jpg to public folder */}
        <div className="backdrop-brightness-95 backdrop-blur-sm h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="flex-shrink-0">
            <div className="w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden border-4 border-white shadow-2xl ring-2 ring-white/20 bg-white">
              {/* Fallback avatar if profile.jpg is missing */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold text-4xl">A</div>
            </div>
          </div>

          <div className="flex-1 ml-4 sm:ml-8 flex flex-col justify-center min-w-0">
            <a href="https://ankitkachhawa.in" className="block mb-2 sm:mb-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <h1 className="text-lg xs:text-xl sm:text-4xl font-bold text-white truncate">ANKIT KACHHAWA</h1>
                {/* Verified badge placeholder */}
                <div className="w-5 h-5 bg-blue-400 rounded-full border border-white text-[10px] flex items-center justify-center text-white">✓</div>
              </div>
              <p className="text-xs sm:text-lg text-white/90 font-medium">Professional Financial Solutions</p>
            </a>

            <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1 sm:mt-2 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg group"
                  aria-label={social.name}
                >
                  <span className="text-white group-hover:text-white/90 transition-colors duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      {/* Sub Navigation */}
      <nav className="fixed top-[180px] left-0 w-full bg-white border-b border-gray-200 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex space-x-8">
              <a
                href="https://ankitkachhawa.in/"
                className="flex items-center py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors duration-300"
              >
                <span>Mutual Fund</span>
              </a>
              <a
                href="https://ankitkachhawa.in/gst"
                className="flex items-center py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors duration-300"
              >
                <span>GST Services</span>
              </a>
              <Link
                href="/"
                className="flex items-center py-4 px-2 text-sm font-medium text-[#3498db] border-b-2 border-[#3498db] transition-colors duration-300"
              >
                <span>GST Tool</span>
              </Link>
              <a
                href="https://ankitkachhawa.in/updates"
                className="flex items-center py-4 px-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors duration-300"
              >
                <span>Updates</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
