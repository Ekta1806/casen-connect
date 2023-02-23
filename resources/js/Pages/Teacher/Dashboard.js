import React from 'react';
import Authenticated from '@/Layouts/Authenticated';

export default function Dashboard(props) {
  return <Authenticated auth={props.auth} errors={props.errors} header={'Dashboard'}></Authenticated>;
}
