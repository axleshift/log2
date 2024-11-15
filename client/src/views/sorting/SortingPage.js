import React, { useState, useMemo, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import axios from 'axios'
{
  /**** 
const SortingPage = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'tracking_id', direction: 'asc' })
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:5058/api/v1/inventory', {
          params: {
            search: searchQuery,
            sortKey: sortConfig.key,
            sortDirection: sortConfig.direction,
          },
        })
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, sortConfig])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    return data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])

  return (
    <CCard>
      <CCardHeader as="h5" style={{ textAlign: 'center' }}>
        Sorted Inventory
      </CCardHeader>
      <CCardBody>
        <CInputGroup style={{ maxWidth: '400px', marginBottom: '1rem' }}>
          <CInputGroupText>Search</CInputGroupText>
          <CFormInput
            type="text"
            placeholder="Search by Tracking ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CInputGroup>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" onClick={() => handleSort('tracking_id')}>
                Tracking ID
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('shipment_description')}>
                Shipment Description
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('shipment_weight')}>
                Weight
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('shipment_dimension_length')}>
                Dimensions
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('shipment_volume')}>
                Volume
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" onClick={() => handleSort('shipment_value')}>
                Value
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="6">Loading...</CTableDataCell>
              </CTableRow>
            ) : (
              sortedData.map((item) => (
                <CTableRow key={item.tracking_id}>
                  <CTableDataCell>{item.tracking_id}</CTableDataCell>
                  <CTableDataCell>{item.shipment_description}</CTableDataCell>
                  <CTableDataCell>{item.shipment_weight}</CTableDataCell>
                  <CTableDataCell>{`${item.shipment_dimension_length} x ${item.shipment_dimension_width} x ${item.shipment_dimension_height}`}</CTableDataCell>
                  <CTableDataCell>{item.shipment_volume}</CTableDataCell>
                  <CTableDataCell>{item.shipment_value}</CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default SortingPage
*/
}
