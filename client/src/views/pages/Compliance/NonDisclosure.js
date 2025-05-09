import React from 'react'

const NonDisclosureAgreement = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Non-Disclosure Agreement (NDA)</h1>
      <p className="text-sm text-gray-600 mb-10">
        <strong>Effective Date:</strong> January 1, 2025
      </p>

      <div className="space-y-10 text-left prose prose-lg mx-auto">
        <section>
          <h2>Parties</h2>
          <p>
            This Agreement is made between the <strong>Disclosing Party</strong>, Freight Management
            System: Logistics 2 Vendor Portal, and the <strong>Receiving Party</strong>, the Vendor.
          </p>
        </section>

        <section>
          <h2>Confidential Information</h2>
          <p>
            Confidential information includes any non-public, proprietary information such as
            business plans, pricing, trade secrets, and client data.
          </p>
        </section>

        <section>
          <h2>Obligations of Receiving Party</h2>
          <p>
            The Receiving Party agrees to keep all confidential information private, not to disclose
            it to any third party without written consent, and to use the information solely for the
            intended business relationship.
          </p>
        </section>

        <section>
          <h2>Exclusions</h2>
          <p>
            This agreement does not apply to information that was already known before disclosure,
            becomes public through no fault of the Receiving Party, or is disclosed legally by
            another source.
          </p>
        </section>

        <section>
          <h2>Term</h2>
          <p>
            This NDA remains in effect for <strong>5 years</strong> from the Effective Date.
          </p>
        </section>

        <section>
          <h2>Legal Remedies</h2>
          <p>
            Unauthorized disclosure may result in legal action for damages or injunctive relief.
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>
            This Agreement is governed by the laws of the <strong>Philippines</strong>.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this NDA, contact us at{' '}
            <strong>logitechw2@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}

export default NonDisclosureAgreement
