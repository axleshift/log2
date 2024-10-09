import { CHeader } from "@coreui/react";
import { left } from "@popperjs/core";
import React, {useState}from "react";
import DataTable from 'react-data-table-component';


function TruckingStatus (){
        const columns = [
          {
            name: 'ID',
            selector: row => row.id,
            sortable: true
            
         },
          {
             name: 'Name',
             selector: row => row.name,
             sortable: true
             
          },
          {
             name: 'Email',
             selector: row => row.email,
             sortable: true
          },
          {
             name: 'Billing Address',
             selector: row => row.billingaddress,
             sortable: true
          },
          {
            name: 'Contact Number',
            selector: row => row.contactnumber,
            sortable: true
          },
          {
            name: 'Recipient Address',
            selector: row => row.recipientaddress,
            sortable: true
         },
         {
          name: 'Recipient Number',
          selector: row => row.recipientnumber,
          sortable: true
         },
         {
          name: 'Weight',
          selector: row => row.weight,
          sortable: true
         },
         {
          name: 'Paid Amount',
          selector: row => row.paidamount,
          sortable: true
         },
         {
          name: 'Quantity',
          selector: row => row.quantity,
          sortable: true
         },
         {
          name: 'Status',
          selector: row => row.status,
          sortable: true
         },
        

        ];
        const data =[
          {
            id: 1 ,
            name: 'Ma.Angelica',
            email:'maanpajimola@gmail.com',
            billingaddress:'quezon city',
            contactnumber:'123456478910',
            recipientaddress:'commonwealth',
            recipientnumber:'123456478910',
            weight:'12kg',
            paidamount:'259',
          },
          {
            id: 2 ,
            name: 'Rona',
            email:'RonaIrader@gmail.com',
            billingaddress:'tondo',
            contactnumber:'123456478910',
            recipientaddress:'quezon city',
            recipientnumber:'123456478910',
            weight:'10kg',
            paidamount:'199',
            
          },
          {
            id: 3,
            name: 'Angel',
            email:'AngelAntonio@gmail.com',
            billingaddress:'bulacan',
            contactnumber:'123456478910',
            recipientaddress:'quezon city',
            recipientnumber:'123456478910',
            weight:'11kg',
            paidamount:'210',

          },
         
        ];
        const customStyles = {
         
            headCells: {
              style:{ 
                fontSize:"13px",
                padding:"10px"
                
              },
              
            },
           
          }
        const [records, setRecords] = useState(data);

        function handleFilter(event){
          const newData = data.filter(row =>{
              return row.name.toLowerCase().includes(event.target.value.toLowerCase())
          })
          setRecords(newData)
        }
        return(
          <div className='container mt-5'>
            
            <CHeader>
            <div className="text-end"><input type="text" onChange={handleFilter} placeholder="Search" /></div>
            <div>
            <button type="button" href="./order.js" className="btn btn-primary me-2" >+ CreatNew</button>
            <button type="button" className="btn btn-primary me-2" >Delete</button>
            </div>
            </CHeader>
            <DataTable
              columns={columns}
              data={records}
              selectableRows
              fixedHeader
              pagination
              customStyles={customStyles}
            ></DataTable>
          </div>
        )
}
export default TruckingStatus;