import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-gray-50 shadow-xl rounded-2xl p-8 max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-sm text-gray-600 mb-6">Effective Date: January 1, 2025</p>

        <div className="space-y-6 text-gray-800 text-base">
          <div>
            <h2 className="text-xl font-semibold mb-1">Acceptance of Terms</h2>
            <p>
              By accessing or using our services, you agree to be bound by these Terms and
              Conditions. If you do not agree, do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Description of Services</h2>
            <p>This is a Vendor Portal with Inventory Management.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">User Responsibilities</h2>
            <p>
              Users must provide accurate registration information, maintain the confidentiality of
              their accounts, and refrain from any illegal or unauthorized use.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Intellectual Property</h2>
            <p>
              All content provided by Freight Management System: Logistics 2 is protected by
              copyright laws. You may not copy, modify, or distribute any part without written
              permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Limitation of Liability</h2>
            <p>
              We are not liable for any indirect, incidental, or consequential damages arising from
              your use of our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of our services means you accept
              the changes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Contact</h2>
            <p>
              For questions about these Terms, contact us at <strong>logitechw2@gmail.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
