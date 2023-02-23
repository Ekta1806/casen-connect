import React from 'react';
import Index from '../Dashboard/Index';
import 'react-quill/dist/quill.snow.css';
import { Question } from '@/Components/Timelines/Details';

export default function List() {
  React.useEffect(() => {
    document.title = 'Daily Questions';
  }, []);

  return (
    <Index header={'Daily Questions'}>
      <Question />
    </Index>
  );
}
