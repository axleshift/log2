import React from 'react'
import { CInputGroup } from '@coreui/react'
import { CInputGroupText } from '@coreui/react'
const Order = () => {
    [
<CFormLabel>
<CInputGroup className="mb-3">
  <CInputGroupText id="basic-addon1">@</CInputGroupText>
  <CFormInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
</CInputGroup>

<CInputGroup className="mb-3">
  <CFormInput placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
  <CInputGroupText id="basic-addon2">@example.com</CInputGroupText>
</CInputGroup>

<CFormLabel htmlFor="basic-url">Your vanity URL</CFormLabel>
<CInputGroup className="mb-3">
  <CInputGroupText id="basic-addon3">https://example.com/users/</CInputGroupText>
  <CFormInput id="basic-url" aria-describedby="basic-addon3"/>
</CInputGroup>

<CInputGroup className="mb-3">
  <CInputGroupText>$</CInputGroupText>
  <CFormInput aria-label="Amount (to the nearest dollar)"/>
  <CInputGroupText>.00</CInputGroupText>
</CInputGroup>

<CInputGroup className="mb-3">
  <CFormInput placeholder="Username" aria-label="Username"/>
  <CInputGroupText>@</CInputGroupText>
  <CFormInput placeholder="Server" aria-label="Server"/>
</CInputGroup>

<CInputGroup>
  <CInputGroupText>With textarea</CInputGroupText>
  <CFormTextarea aria-label="With textarea"></CFormTextarea>
</CInputGroup>
</CFormLabel>
    ]
}
