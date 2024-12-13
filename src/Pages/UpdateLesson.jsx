import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Spinner } from '@nextui-org/react';
import { useAsyncList } from '@react-stately/data';

const UpdateLesson = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const list = useAsyncList({
    async load({ signal }) {
      try {
        const token = localStorage.getItem('token');
        let res = await fetch(`http://localhost:5000/lessons/${lessonId}`, {
          signal,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch lessons');
        }

        let json = await res.json();
        setLesson(json);
        setIsLoading(false);
        return {
          items: [json]
        };
      } catch (error) {
        console.error(error);
        return { items: [] };
      }
    }
  });

  const updateLesson = async () => {
    if (!lesson) return;

    const token = localStorage.getItem('token');
    try {
      let res = await fetch(`http://localhost:5000/lessons/${lesson._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(lesson)
      });

      if (res.ok) {
        navigate('/dashboard/lessons'); // Navigate to the dashboard after successful update
      } else {
        console.error('Failed to update lesson');
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  if (isLoading) {
    return <Spinner label="Loading..." />;
  }

  return (
    <div className='space-y-6'>
      <h3>Update Lesson</h3>
      <Input
        label="Lesson Number"
        value={lesson.number || ''}
        onChange={(e) => setLesson({ ...lesson, number: e.target.value })}
      />
      <Input
        label="Lesson Name"
        value={lesson.name || ''}
        onChange={(e) => setLesson({ ...lesson, name: e.target.value })}
      />
      <Button className='' color='success' auto onPress={updateLesson}>
        Save
      </Button>
    </div>
  );
};

export default UpdateLesson;
