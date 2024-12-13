import { useAsyncList } from '@react-stately/data';
import DashboardHeader from '../Utils/DashboardHeader';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  getKeyValue,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

const AllLessons = () => {
  const [isLoading, setIsLoading] = useState(true);
  const list = useAsyncList({
    async load({ signal }) {
      const token = localStorage.getItem('token');
      let res = await fetch('http://localhost:5000/lessons', {
        signal,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch lessons');
      }

      let json = await res.json();
      setIsLoading(false);
      return {
        items: json
      };
    }
  });

  const navigate = useNavigate();

  // Delete a lesson
  const deleteLesson = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    // If user confirms, proceed with deletion
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        let res = await fetch(`http://localhost:5000/lessons/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (res.ok) {
          await list.reload(); // Refresh the list
          Swal.fire('Deleted!', 'The lesson has been deleted.', 'success');
        } else {
          Swal.fire('Error!', 'Failed to delete the lesson.', 'error');
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
        Swal.fire('Error!', 'An error occurred while deleting the lesson.', 'error');
      }
    }
  };
  
  

  return (
    <div>
      <DashboardHeader
        root={'/dashboard'}
        rValue={'Dashboard'}
        sRValue={'All Lessons'}
        page={'All Lessons'}
      />

      <Table
        aria-label="Lessons Table"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        isStriped
      >
        <TableHeader>
          <TableColumn key="number" allowsSorting>
            Lesson Number
          </TableColumn>
          <TableColumn key="name" allowsSorting>
            Lesson Name
          </TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'actions' ? (
                    <>
                      <Button
                        auto
                        color="success"
                        onClick={() => {
                          navigate(`/dashboard/update-lesson/${item._id}`); // Navigate to the update page
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        auto
                        color="error"
                        onClick={() => deleteLesson(item._id)}
                      >
                        Delete
                      </Button>
                    </>
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
};

export default AllLessons;
