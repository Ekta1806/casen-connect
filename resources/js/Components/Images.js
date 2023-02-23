import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default function Images({ media,index,closeModel,setIndex }) {

  return (
    <>
        <Lightbox
          mainSrc={media[index].original_url}
          nextSrc={media[(index + 1) % media.length].original_url}
          prevSrc={media[(index + media.length - 1) % media.length].original_url}
          onCloseRequest={() => closeModel()}
          onMovePrevRequest={() => setIndex((index + media.length - 1) % media.length)}
          onMoveNextRequest={() => setIndex((index + 1) % media.length)}
        />
    </>
  );
}
