import React, { useEffect, useState } from 'react';
import { Input, Textarea, Button, Spinner } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateVocabulary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vocab = location.state?.vocab;
  const [currentVocab, setCurrentVocab] = useState(vocab || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!vocab) {
      navigate('/');
    }
  }, [vocab, navigate]);

  const handleUpdate = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `http://localhost:5000/lessons/${currentVocab.lessonId}/vocabulary/${currentVocab.vocabId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word: currentVocab.word,
            pronunciation: currentVocab.pronunciation,
            meaning: currentVocab.meaning,
            whenToUse: currentVocab.whenToUse,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update vocabulary');
      }

      Swal.fire('Success', 'Vocabulary updated successfully', 'success');
      navigate('/dashboard/vocabularies'); // Redirect back to the vocabularies list page
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner label="Updating..." />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Vocabulary</h1>
      <Input
        label="Word"
        value={currentVocab.word}
        onChange={(e) => setCurrentVocab({ ...currentVocab, word: e.target.value })}
        className="mb-4"
      />
      <Input
        label="Pronunciation"
        value={currentVocab.pronunciation}
        onChange={(e) => setCurrentVocab({ ...currentVocab, pronunciation: e.target.value })}
        className="mb-4"
      />
      <Textarea
        label="Meaning"
        value={currentVocab.meaning}
        onChange={(e) => setCurrentVocab({ ...currentVocab, meaning: e.target.value })}
        className="mb-4"
      />
      <Textarea
        label="When to Use"
        value={currentVocab.whenToUse}
        onChange={(e) => setCurrentVocab({ ...currentVocab, whenToUse: e.target.value })}
        className="mb-4"
      />
      <Button color="primary" onPress={handleUpdate}>
        Save Changes
      </Button>
    </div>
  );
};

export default UpdateVocabulary;
