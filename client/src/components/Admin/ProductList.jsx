import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './ProductList.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProducts, clearErrors, delProduct } from '../../actions/productActions';
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';

const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, products } = useSelector((state) => state.products);
  const { error: deleteProductError, isDeleted } = useSelector((state) => state.product);

  const deleteProductHandler = (id) => {
    dispatch(delProduct(id));
  };

  const columns = [
    { field: 'id', headerName: 'ID Producto', minWidth: 200, flex: 0.5 },
    { field: 'name', headerName: 'Nombre', minWidth: 350, flex: 1 },
    { field: 'stock', headerName: 'Stock', type: 'number', minWidth: 150, flex: 0.3 },
    { field: 'price', headerName: 'Precio', type: 'number', minWidth: 270, flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/product/${params.getValue(params.id, 'id')}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteProductHandler(params.getValue(params.id, 'id'))}>
              <DeleteIcon />
            </Button>
          </>
        );
      }
    }
  ];

  const rows = [];

  if (products) {
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name
      });
    });
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteProductError) {
      alert.error(deleteProductError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success('Producto Eliminado');
      navigate('/admin/dashboard');
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProducts());
  }, [alert, error, dispatch, deleteProductError, isDeleted, navigate]);

  return (
    <>
      <MetaData title="TODOS LOS PRODUCTOS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">TODOS LOS PRODUCTOS</h1>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
