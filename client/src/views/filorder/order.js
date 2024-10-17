import React, { useState, useEffect } from 'react';
import {
  CFormInput,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CCardHeader,
  CButton,
  CCardFooter,
  CForm,
} from '@coreui/react';
import './order.scss';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../api/invoiceService';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    customerName: '',
    email: '',
    address: '',
    contactNumber: '',
    fullName: '',
    recipientAddress: '',
    recipientContactNumber: '',
    weight: '',
    cost: '',
    quantity: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null); // For error messages

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getInvoices();
      setOrders(response); 
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInvoice(editingId, formData);
      } else {
        await createInvoice(formData);
      }
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error saving order:', error);
      setError('Failed to save order. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      customerName: '',
      email: '',
      address: '',
      contactNumber: '',
      fullName: '',
      recipientAddress: '',
      recipientContactNumber: '',
      weight: '',
      cost: '',
      quantity: '',
    });
    setEditingId(null);
    setError(null); // Clear any errors
  };

  const handleEdit = (order) => {
    setFormData(order);
    setEditingId(order.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order. Please try again.');
    }
  };

  return (
    <CCard>
      <CCardHeader className="CardHeader">
        <h1>Customer Information</h1>
      </CCardHeader>
      <CCardBody>
        {error && <div className="error-message">{error}</div>} {/* Display error messages */}
        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                id="id"
                label="ID"
                placeholder="0"
                value={formData.id}
                onChange={handleChange}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                id="customerName"
                label="Customer Name"
                placeholder="Juan Dela Cruz"
                value={formData.customerName}
                onChange={handleChange}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="email"
                id="email"
                label="Email Address"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                id="address"
                label="Address"
                placeholder="number and street name"
                value={formData.address}
                onChange={handleChange}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                id="contactNumber"
                label="Contact Number"
                placeholder="000 0000 0000"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                id="fullName"
                label="Full Name"
                placeholder="Juan Dela Cruz"
                value={formData.fullName}
                onChange={handleChange}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                id="recipientAddress"
                label="Recipient Address"
                placeholder="number and street name"
                value={formData.recipientAddress}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                id="recipientContactNumber"
                label="Recipient Contact Number"
                placeholder="000 0000 0000"
                value={formData.recipientContactNumber}
                onChange={handleChange}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="text"
                id="weight"
                label="Weight"
                value={formData.weight}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                id="cost"
                label="Cost"
                value={formData.cost}
                onChange={handleChange}
              />
            </CCol>
            <CCol>
              <CFormInput
                type="number"
                id="quantity"
                label="Product Quantity"
                placeholder="1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <div className="d-grid gap-2 col-6 mx-auto">
            <CButton color="primary" shape="rounded-pill" type="submit">
              {editingId ? 'UPDATE' : 'SUBMIT'}
            </CButton>
          </div>
        </CForm>
      </CCardBody>

      <CCardFooter>
        <h3>Orders List</h3>
        <ul>
          {orders.length > 0 ? ( 
            orders.map((order) => (
              <li key={order.id}>
                {order.customerName} - {order.email}
                <CButton color="warning" onClick={() => handleEdit(order)}>
                  Edit
                </CButton>
                <CButton color="danger" onClick={() => handleDelete(order.id)}>
                  Delete
                </CButton>
              </li>
            ))
          ) : (
            <li>No orders found.</li> 
          )}
        </ul>
      </CCardFooter>
    </CCard>
  );
};

export default Order;
