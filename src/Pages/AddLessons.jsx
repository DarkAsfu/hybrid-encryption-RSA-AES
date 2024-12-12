import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import DashboardHeader from '../Utils/DashboardHeader';
import Swal from 'sweetalert2';

const AddLessons = () => {
  const [lessonName, setLessonName] = useState('');
  const [lessonNumber, setLessonNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: lessonName,
          number: lessonNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add lesson');
      }

      const result = await response.json();
      Swal.fire('Success!', result.message, 'success');
      setLessonName('');
      setLessonNumber('');
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        root={'/dashboard'}
        rValue={'Dashboard'}
        sRValue={'Add Lessons'}
        page={'Add Lessons'}
      />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Lesson Name"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          required
        />
        <Input
          type="number"
          label="Lesson Number"
          value={lessonNumber}
          onChange={(e) => setLessonNumber(e.target.value)}
          required
        />
        <Button color="success" type="submit" isDisabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Lesson'}
        </Button>
      </form>
    </div>
  );
};

export default AddLessons;
