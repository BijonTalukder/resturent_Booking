import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#eef0f4] py-8 px-4">
      <div className="neu-card max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-[#373b43] mb-4">Privacy Policy</h1>
        <p className="text-sm text-[#6b7588] mb-6">Effective Date: 10/5/2025</p>

        <p className="mb-4 text-[#484f5c]">
          Thank you for using <strong>BEHB Hotel Booking</strong> ("we", "us", or "our").
          This Privacy Policy explains how we collect, use, and protect your personal information
          when you use our hotel booking mobile application, available on the Google Play Store.
        </p>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4 text-[#484f5c]">
          <li><strong>Personal Information:</strong> Mobile number, email address, password (encrypted)</li>
          <li><strong>Booking Information:</strong> Hotel name, dates, room types, number of guests</li>
          <li><strong>Payment Information:</strong> Processed securely via SSLCommerz. We do not store card data.</li>
          <li><strong>Device Information:</strong> Device model, OS version, unique identifiers for analytics</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4 text-[#484f5c]">
          <li>Create and manage your account</li>
          <li>Enable hotel booking functionality</li>
          <li>Process secure payments via SSLCommerz</li>
          <li>Send booking confirmations and notifications</li>
          <li>Improve app performance and user experience</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">3. Data Sharing and Disclosure</h2>
        <p className="mb-4 text-[#484f5c]">
          We do <strong>not</strong> sell or rent your personal data. We may share your data with:
        </p>
        <ul className="list-disc list-inside mb-4 text-[#484f5c]">
          <li>Hotel admins for booking purposes</li>
          <li>SSLCommerz for payment processing</li>
          <li>Service providers for analytics and hosting</li>
          <li>Law enforcement, if legally required</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">4. Data Security</h2>
        <p className="mb-4 text-[#484f5c]">
          We use industry-standard encryption and secure servers to protect your data. 
          Passwords are encrypted, and payment processing is PCI-DSS compliant via SSLCommerz.
        </p>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">5. User Rights</h2>
        <ul className="list-disc list-inside mb-4 text-[#484f5c]">
          <li>View or update your profile</li>
          <li>Delete your account by contacting us</li>
          <li>Opt out of marketing emails (if applicable)</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">6. Third-Party Services</h2>
        <p className="mb-4 text-[#484f5c]">
          Our app uses third-party services such as:
        </p>
        <ul className="list-disc list-inside mb-4 text-[#484f5c]">
          <li>SSLCommerz (for payments)</li>
          <li>Google Play Services (for analytics, performance)</li>
        </ul>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">7. Children's Privacy</h2>
        <p className="mb-4 text-[#484f5c]">
          Our app is not intended for children under 13. We do not knowingly collect data from children.
        </p>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">8. Changes to This Policy</h2>
        <p className="mb-4 text-[#484f5c]">
          We may update this Privacy Policy from time to time. You will be notified via app notifications or email.
        </p>

        <h2 className="text-xl font-semibold text-[#373b43] mt-6 mb-2">9. Contact Us</h2>
        <p className="mb-4 text-[#484f5c]">
          If you have any questions or concerns about this policy, contact us at:
        </p>
        <p className="font-semibold text-primary">bijontalukder1247@gmail.com</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
