'use client'

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import Header from './Header';

const HeaderProvider = () => {
  const { id } = useParams();
  useEffect(() => {}, [id]);

  return (
    <Header id={id !== undefined ? id : 'abcd'}/>
  )
}

export default HeaderProvider