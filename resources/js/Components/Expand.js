import React, { useState } from 'react';
import { ListItem, Collapse } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { AddComment, AddCommentTeacher, AddPostAdminComment } from '@/Modals/AddComment';
import { AddClassPostComment, AddClassPostCommentTeacher, AddAdminComment } from '@/Modals/AddClassPostComment';
import { AddAdminOwnPostComment, AddStudentAdminOwnPostComment, AddTeacherAdminOwnPostComment } from '@/Modals/AddAdminOwnPostComment';

function ClassExpand({
  teacherData,
  valueOne,
  value,
  children,
  fetchRoute,
  modulePanel,
  modulePaneltwo,
  commentLenth,
}) {
  const id = children;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (isExpanded) => {
    setExpanded(isExpanded ? !expanded : false);
  };

  return (
    <>
      <div className="p-1 flex items-center ml-0 md:ml-2">
        <ListItem button={true} onClick={handleExpandClick}>
          {commentLenth ? '' : <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />}
          <span className="text-sm md:text-base text-black-800 ml-1">
            {(valueOne == 1 && <p>{valueOne} comment</p>) ||
              (valueOne == 0 && <p>comment</p>) ||
              (valueOne > 1 && <p>{valueOne} comments</p>)}
          </span>

          {commentLenth && (
            <>
              {' '}
              <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />
              <span className="text-sm md:text-base text-black-800 ml-1">
                {(commentLenth == 1 && <p>{commentLenth} Pending comment</p>) ||
                  (commentLenth > 1 && <p>{commentLenth} Pending comments</p>)}
              </span>
            </>
          )}
        </ListItem>
      </div>
      <div className={`${expanded == true && 'border-t-2'} w-full`}>
        <Collapse className="" in={expanded} timeout="auto" unmountOnExit={true}>
          {fetchRoute && modulePanel && modulePaneltwo ? (
            <>
              <AddClassPostCommentTeacher
                commentCount={valueOne}
                value={id}
                props={value}
                modulePanel={modulePanel}
                modulePaneltwo={modulePaneltwo}
              />
            </>
          ) : (
            <>
              <AddClassPostComment
                teacherData={teacherData}
                value={id}
                props={value}
                commentCount={valueOne}
                modulePanel=""
                modulePaneltwo=""
              />
            </>
          )}
        </Collapse>
      </div>
    </>
  );
}

function Expand({ teacherData, valueOne, value, children, fetchRoute, modulePanel, modulePaneltwo, commentLenth }) {
  const id = children;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (isExpanded) => {
    setExpanded(isExpanded ? !expanded : false);
  };

  return (
    <>
      <div className="p-1 flex items-center ml-0 md:ml-2">
        <ListItem button={true} onClick={handleExpandClick}>
          {commentLenth ? '' : <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />}
          {!commentLenth && (
            <span className="text-sm md:text-base text-black-800 ml-1">
              {(valueOne == 1 && <p>{valueOne} comment</p>) ||
                (valueOne == 0 && <p>comment</p>) ||
                (valueOne > 1 && <p>{valueOne} comments</p>)}
            </span>
          )}

          {commentLenth && (
            <>
              {' '}
              <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />
              <span className="text-sm md:text-base text-black-800 ml-1">
                {(commentLenth == 1 && <p>{commentLenth} Pending comment</p>) ||
                  (commentLenth > 1 && <p>{commentLenth} Pending comments</p>)}
              </span>
            </>
          )}
        </ListItem>
      </div>
      <div className={`${expanded == true && 'border-t-2'} w-full`}>
        <Collapse className="" in={expanded} timeout="auto" unmountOnExit={true}>
          {fetchRoute != '' && modulePanel != '' && modulePaneltwo != '' ? (
            <>
              <AddCommentTeacher
                fetchRoute={fetchRoute}
                teacherData={teacherData}
                value={id}
                props={value}
                commentCount={valueOne}
                modulePanel={modulePanel}
                modulePaneltwo={modulePaneltwo}
              />
            </>
          ) : (
            <>
              <AddComment
                teacherData={teacherData}
                value={id}
                props={value}
                commentCount={valueOne}
                modulePanel=""
                modulePaneltwo=""
              />
            </>
          )}
        </Collapse>
      </div>
    </>
  );
}

function AdminClassExpand({ value, children, fetchRoute, modulePanel, valueOne, commentLenth, postId}) {
  const id = children;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (isExpanded) => {
    setExpanded(isExpanded ? !expanded : false);
  };

  return (
    <>
      <div className="p-1 flex items-center ml-2">
        <ListItem button={true} onClick={handleExpandClick}>
          {commentLenth ? '' : <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />}
          <span className="text-sm md:text-base text-black-800 ml-1">
            {(valueOne == 1 && <p>{valueOne} comment</p>) ||
              (valueOne == 0 && <p>comment</p>) ||
              (valueOne > 1 && <p>{valueOne} comments</p>)}
          </span>

          {commentLenth && (
            <>
              {' '}
              <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />
              <span className="text-sm md:text-base text-black-800 ml-1">
                {(commentLenth == 1 && <p>{commentLenth} Pending comment</p>) ||
                  (commentLenth > 1 && <p>{commentLenth} Pending comments</p>)}
              </span>
            </>
          )}
        </ListItem>
      </div>
      <div className={`${expanded == true && 'border-t-2'} w-full`}>
        <Collapse className="" in={expanded} timeout="auto" unmountOnExit={true}>
          {fetchRoute && modulePanel && (
            <>
              <AddAdminComment
                fetchRoute={fetchRoute}
                commentCount={valueOne}
                props={value}
                modulePanel={modulePanel}
                value ={value}
                postId={postId}
              />
            </>
          )}
        </Collapse>
      </div>
    </>
  );
}

function AdminExpand({ value, children, fetchRoute, modulePanel, valueOne, commentLenth,postId }) {
  const id = children;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (isExpanded) => {
    setExpanded(isExpanded ? !expanded : false);
  };

  return (
    <>
      <div className="p-1 flex items-center ml-0 md:ml-2">
        <ListItem button={true} onClick={handleExpandClick}>
          {commentLenth ? '' : <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />}
          <span className="text-sm md:text-base text-black-800 ml-1">
            {(valueOne == 1 && <p>{valueOne} comment</p>) ||
              (valueOne == 0 && <p>comment</p>) ||
              (valueOne > 1 && <p>{valueOne} comments</p>)}
          </span>

          {commentLenth && (
            <>
              {' '}
              <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />
              <span className="text-sm md:text-base text-black-800 ml-1">
                {(commentLenth == 1 && <p>{commentLenth} Pending comment</p>) ||
                  (commentLenth > 1 && <p>{commentLenth} Pending comments</p>)}
              </span>
            </>
          )}
        </ListItem>
      </div>
      <div className={`${expanded == true && 'border-t-2'} w-full`}>
        <Collapse className="" in={expanded} timeout="auto" unmountOnExit={true}>
          {fetchRoute && modulePanel && (
            <>
              <AddPostAdminComment
                fetchRoute={fetchRoute}
                commentCount={valueOne}
                props={value}
                modulePanel={modulePanel}
                value ={value}
                postId={postId}
              />
            </>
          )}
        </Collapse>
      </div>
    </>
  );
}

function AdminOwnPostExpand({
  valueOne,
  value,
  children,
  modulePanel,
  isFriday}){
  const id = children;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (isExpanded) => {
    setExpanded(isExpanded ? !expanded : false);
  };

  return (
    <>
      <div className="p-1 flex items-center ml-0 md:ml-2">
        <ListItem button={true} onClick={handleExpandClick}>
         <ChatBubbleOutlineOutlinedIcon className="text-gray-500 hover:rounded-lg" value={id} />
          <span className="text-sm md:text-base text-black-800 ml-1">
            {(valueOne == 1 && <p>{valueOne} comment</p>) ||
              (valueOne == 0 && <p>comment</p>) ||
              (valueOne > 1 && <p>{valueOne} comments</p>)}
          </span>
        </ListItem>
      </div>
      <div className={`${expanded == true && 'border-t-2'} w-full`}>
        <Collapse className="" in={expanded} timeout="auto" unmountOnExit={true}>
          {modulePanel === "admin" &&  
            <AddAdminOwnPostComment
              commentCount={valueOne}
              props={value}
              value={id}
              modulePanel={modulePanel}
            />
          }
          {modulePanel === "student" &&  
            <AddStudentAdminOwnPostComment
              commentCount={valueOne}
              props={value}
              value={id}
              modulePanel={modulePanel}
              isFriday={isFriday}
            />
          }
          {modulePanel === "teacher" &&  
            <AddTeacherAdminOwnPostComment
              commentCount={valueOne}
              props={value}
              value={id}
              modulePanel={modulePanel}
              isFriday={isFriday}
            />
          }
        </Collapse>
      </div>
    </>
  );
}

export { ClassExpand, Expand, AdminClassExpand, AdminExpand, AdminOwnPostExpand };
