import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <div className="mb-2 p-4 items-center">
                <h1 className="text-4xl text-gray-900 dark:text-white">Privacy Policy</h1>
                <p className="text-gray-700 dark:text-slate-500">
                    Your privacy is important to us. Please read this privacy policy to understand how we handle your personal information.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 mb-10 w-full p-6 rounded-lg shadow-md">
                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">1. Information We Collect</h2>
                <p className="mb-4 text-gray-800 dark:text-white">
                    We collect various types of information in connection with the services we provide, including:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-900 dark:text-white">
                    <li>Personal information you provide directly to us.</li>
                    <li>Information we collect about your use of our services.</li>
                    <li>Information we obtain from third-party sources.</li>
                </ul>

                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">2. How We Use Your Information</h2>
                <p className="mb-4 text-gray-900 dark:text-white">
                    We use the information we collect to provide, maintain, and improve our services, including to:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-900 dark:text-white">
                    <li>Process your transactions and manage your account.</li>
                    <li>Provide customer support and respond to your inquiries.</li>
                    <li>Send you updates, newsletters, and other communications.</li>
                    <li>Analyze usage patterns to improve our services.</li>
                </ul>

                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">3. Information Sharing and Disclosure</h2>
                <p className="mb-4 text-gray-900 dark:text-white">
                    We do not share your personal information with third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-900 dark:text-white">
                    <li>With your consent.</li>
                    <li>For external processing by trusted partners.</li>
                    <li>For legal reasons, such as complying with legal obligations.</li>
                </ul>

                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">4. Data Security</h2>
                <p className="mb-4 text-gray-900 dark:text-white">
                    We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.
                </p>

                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">5. Your Choices</h2>
                <p className="mb-4 text-gray-900 dark:text-white">
                    You have the following choices regarding your information:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-900 dark:text-white">
                    <li>Access and update your account information.</li>
                    <li>Opt-out of receiving marketing communications.</li>
                    <li>Delete your account and personal information.</li>
                </ul>

                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">6. Changes to this Privacy Policy</h2>
                <p className="mb-4 text-gray-900 dark:text-white">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on our website. Your continued use of our services after the changes take effect constitutes your acceptance of the new policy.
                </p>

                <h2 className="text-3xl text-green-800 dark:text-[#128931] mb-4">7. Contact Us</h2>
                <p className="mb-4 text-gray-900 dark:text-white">
                    If you have any questions or concerns about this privacy policy, please contact us at support@wearablehealth.com.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
