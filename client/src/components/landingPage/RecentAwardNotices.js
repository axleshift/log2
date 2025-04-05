import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CFormInput,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CSpinner,
} from '@coreui/react'

const RecentAwardNotices = () => {
  const [awardNotices, setAwardNotices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAwardNotices = async () => {
      try {
        const res = await fetch('https://backend-log2.axleshift.com/api/v1/awards') // or update to correct route
        const data = await res.json()
        setAwardNotices(data)
      } catch (err) {
        console.error('Failed to fetch award notices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAwardNotices()
  }, [])

  const filteredNotices = awardNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <CContainer className="p-5">
      <h3 className="mb-4 text-center">Recent Award Notices</h3>

      <CFormInput
        type="text"
        placeholder="Search notices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {loading ? (
        <div className="text-center">
          <CSpinner color="primary" />
        </div>
      ) : (
        <CAccordion alwaysOpen>
          {filteredNotices.map((notice, index) => (
            <CAccordionItem key={notice._id || index} itemKey={index.toString()}>
              <CAccordionHeader>
                {index + 1}. {notice.title}
              </CAccordionHeader>
              <CAccordionBody>
                <p>
                  <strong>Amount:</strong> PHP {parseFloat(notice.amount).toLocaleString()}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(notice.date).toLocaleDateString()}
                </p>
                <p>{notice.details || 'No additional details provided.'}</p>
              </CAccordionBody>
            </CAccordionItem>
          ))}
          {filteredNotices.length === 0 && <p className="text-center">No notices found.</p>}
        </CAccordion>
      )}
    </CContainer>
  )
}

export default RecentAwardNotices
