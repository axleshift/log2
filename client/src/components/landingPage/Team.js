import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardTitle,
  CCardText,
  CCardBody,
  CImage,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShip, faRoute, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'

const Team = () => {
  const teamMembers = [
    {
      name: 'Rona P. Irader',
      major: 'IM',
      image: 'https://avatars.githubusercontent.com/u/126496983?s=400&u=22d294fa41d24060eba0b1b556cd84c01c293cd6&v=4',
    },
    {
      name: 'Ma Angelica Olavidez',
      major: 'IM',
      image: 'https://avatars.githubusercontent.com/u/127282844?v=4&size=64',
    },
    {
      name: 'Rhica Mhay E. Ricafranca',
      major: 'NA',
      image: 'https://avatars.githubusercontent.com/u/127093925?v=4',
    },
    {
      name: 'Brian Joseph P. Pura',
      major: 'IS',
      image: 'https://avatars.githubusercontent.com/u/186307007?v=4&size=64',
    },
    {
      name: 'Louise Dollosa',
      major: 'IS',
      image: 'https://avatars.githubusercontent.com/u/62317165?v=4',
    },
  ]

  return (
    <CContainer fluid className="h-100 p-5">
      <div className="mt-5 text-center mb-5" data-aos="fade-down">
        <span>TEAM</span>
        <h2 className="text-primary">Our Tech-savy Team</h2>
      </div>
      <CRow>
        {teamMembers.map((member, index) => (
          <CCol key={index} xs={12} md={4} className="mb-4" data-aos="fade-up ">
            <div className="text-center d-flex flex-column justify-content-center">
              <CImage
                src={member.image}
                className="rounded-pill mx-auto mb-2 border border-primary p-1"
                style={{ width: '100px', height: '100px' }}
              />
              <div className="d-flex flex-column align-items-center">
                <h4>{member.name}</h4>
                <span>{member.major}</span>
              </div>
            </div>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  )
}

export default Team
