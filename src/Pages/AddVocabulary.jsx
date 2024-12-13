import { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem } from '@nextui-org/react';
import DashboardHeader from '../Utils/DashboardHeader';
import Swal from 'sweetalert2';

const AddVocabulary = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [meaning, setMeaning] = useState('');
  const [whenToUse, setWhenToUse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/lessons', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const data = await res.json();
        setLessons(data);
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    };

    fetchLessons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLesson) {
      Swal.fire('Error!', 'Please select a lesson.', 'error');
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/lessons/${selectedLesson}/vocabulary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ word, pronunciation, meaning, whenToUse }),
      });

      if (!res.ok) {
        throw new Error('Failed to add vocabulary');
      }

      const result = await res.json();
      Swal.fire('Success!', result.message, 'success');
      setWord('');
      setPronunciation('');
      setMeaning('');
      setWhenToUse('');
      setSelectedLesson('');
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        root={'/dashboard'}
        rValue={'Dashboard'}
        sRValue={'Add Vocabulary'}
        page={'Add Vocabulary'}
      />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Select
          className="max-w-xs"
          items={lessons.map((lesson) => ({ key: lesson._id, label: `${lesson.number}: ${lesson.name}` }))}
          label="Select Lesson"
          placeholder="Choose a lesson"
          selectedKeys={[selectedLesson]}
          onSelectionChange={(keys) => setSelectedLesson(Array.from(keys)[0])}
        >
          {(lesson) => <SelectItem key={lesson.key}>{lesson.label}</SelectItem>}
        </Select>

        <Input
          type="text"
          label="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
        />
        <Input
          type="text"
          label="Pronunciation"
          value={pronunciation}
          onChange={(e) => setPronunciation(e.target.value)}
          required
        />
        <Input
          type="text"
          label="Meaning"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          required
        />
        <Input
          type="text"
          label="When to Use"
          value={whenToUse}
          onChange={(e) => setWhenToUse(e.target.value)}
          required
        />
        <Button type="submit" color="success" isDisabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Vocabulary'}
        </Button>
      </form>
    </div>
  );
};

export default AddVocabulary;
