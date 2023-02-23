import React from 'react';
import { Head } from '@inertiajs/inertia-react';

export default function Titlebar(props) {
  return <Head title={props.title} />;
}
