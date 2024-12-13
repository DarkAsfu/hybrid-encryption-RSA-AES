import { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Spinner } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AllVocabularies = () => {
  const [vocabularies, setVocabularies] = useState([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState([]);
  const [lessonFilter, setLessonFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // React Router's hook for navigation

  useEffect(() => {
    const fetchVocabularies = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/vocabularies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch vocabularies');
        }

        const data = await res.json();
        setVocabularies(data);
        setFilteredVocabularies(data);
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVocabularies();
  }, []);

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setLessonFilter(filterValue);

    if (filterValue === '') {
      setFilteredVocabularies(vocabularies);
    } else {
      const filtered = vocabularies.filter(
        (vocab) => String(vocab.lessonNo) === filterValue
      );
      setFilteredVocabularies(filtered);
    }
  };

  const handleDelete = async (lessonId, vocabId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:5000/lessons/${lessonId}/vocabulary/${vocabId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to delete vocabulary');
      }

      Swal.fire('Success', 'Vocabulary deleted successfully', 'success');
      setFilteredVocabularies((prev) =>
        prev.filter((vocab) => vocab.vocabId !== vocabId)
      );
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleUpdate = (vocab) => {
    navigate(`/dashboard/update-vocabulary/${vocab.vocabId}`, { state: { vocab } });
  };

  if (isLoading) {
    return <Spinner label="Loading..." />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Vocabularies</h1>
      <Input
        placeholder="Filter by Lesson Number"
        value={lessonFilter}
        onChange={handleFilterChange}
        clearable
        className="mb-4"
      />
      <Table aria-label="Vocabularies Table" striped hoverable className="w-full">
        <TableHeader>
          <TableColumn>Word</TableColumn>
          <TableColumn>Meaning</TableColumn>
          <TableColumn>Pronunciation</TableColumn>
          <TableColumn>When to Say</TableColumn>
          <TableColumn>Lesson No</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredVocabularies.map((vocab) => (
            <TableRow key={vocab.vocabId}>
              <TableCell>{vocab.word}</TableCell>
              <TableCell>{vocab.meaning}</TableCell>
              <TableCell>{vocab.pronunciation}</TableCell>
              <TableCell>{vocab.whenToUse}</TableCell>
              <TableCell>{vocab.lessonNo}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  color="primary"
                  onPress={() => handleUpdate(vocab)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onPress={() => handleDelete(vocab.lessonId, vocab.vocabId)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllVocabularies;
