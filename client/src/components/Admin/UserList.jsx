import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import './ProductList.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers, deleteUser, clearErrors } from '../../actions/userActions';
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Sidebar from './Sidebar';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UserList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, users } = useSelector((state) => state.allUsers);
  const { error: deleteUserError, isUserDeleted, message } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    { field: 'id', headerName: 'ID Usuario', minWidth: 180, flex: 0.8 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'name', headerName: 'Nombre y Apellido', minWidth: 200, flex: 0.5 },
    { field: 'role',
      headerName: 'Rol',
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, 'role') === 'admin'
          ? 'greenColor'
          : 'redColor';
      }
    },
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
            <Link to={`/admin/user/${params.getValue(params.id, 'id')}`}>
              <EditIcon />
            </Link>
            <Button onClick={() => deleteUserHandler(params.getValue(params.id, 'id'))}>
              <DeleteIcon />
            </Button>
          </>
        );
      }
    }
  ];

  const rows = [];

  if (users) {
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name
      });
    });
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteUserError) {
      alert.error(deleteUserError);
      dispatch(clearErrors());
    }

    if (isUserDeleted) {
      alert.success(message);
      navigate('/admin/users');
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [alert, error, dispatch, deleteUserError, isUserDeleted, navigate, message]);
  return (
    <>
      <MetaData title="TODOS LOS USUARIOS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">TODOS LOS USUARIOS</h1>
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

export default UserList;
