import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from '@nextui-org/react';
import { useAsyncList } from '@react-stately/data';
import Swal from 'sweetalert2';
import DashboardHeader from '../Utils/DashboardHeader';

export default function AllUsers() {
  const [isLoading, setIsLoading] = React.useState(true);

  let list = useAsyncList({
    async load({ signal }) {
      const token = localStorage.getItem('token');
      let res = await fetch('http://localhost:5000/users', {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      let json = await res.json();
      setIsLoading(false);
      return {
        items: json,
      };
    },
  });

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      let res = await fetch(`http://localhost:5000/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to update user role');
      }
  
      const { message, token: newToken } = await res.json();
      Swal.fire('Success!', message, 'success');
  
      // If the role of the current user is updated, force logout
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (userId === decodedToken.id) {
        Swal.fire({
          title: 'Role Changed',
          text: 'Your role has been updated. Please log in again to access your new permissions.',
          icon: 'info',
        }).then(() => {
          localStorage.clear();
          window.location.href = '/auth/login'; // Redirect to login page
        });
      } else {
        // Update the list for the changed user
        list.update(userId, { ...list.getItem(userId), role: newRole });
      }
    } catch (error) {
      console.error('Error updating role:', error.message);
      Swal.fire('Error!', 'Failed to update user role!', 'error');
    }
  };
  
  return (
    <div>
      <DashboardHeader
        root={'/dashboard'}
        sRValue={'All Users'}
        rValue={'Dashboard'}
        page={'All Users'}
      />
      <Table
        aria-label="Users Table"
        classNames={{
          table: 'min-h-[400px]',
        }}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="image">Profile Image</TableColumn>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="email" allowsSorting>
            Email
          </TableColumn>
          <TableColumn key="role" allowsSorting>
            Role
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Loading..." />}
        >
          {item => (
            <TableRow key={item._id}>
              {columnKey => (
                <TableCell>
                  {columnKey === 'image' ? (
                    <img
                      src={item.profilePicture || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : columnKey === 'role' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRoleChange(item._id, 'User')}
                        className={`px-3 py-1 rounded text-white ${
                          item.role === 'User' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        disabled={item.role === 'User'}
                      >
                        User
                      </button>
                      <button
                        onClick={() => handleRoleChange(item._id, 'Admin')}
                        className={`px-3 py-1 rounded text-white ${
                          item.role === 'Admin' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        disabled={item.role === 'Admin'}
                      >
                        Admin
                      </button>
                    </div>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
