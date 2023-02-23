import React, { useState, useRef, useEffect } from 'react';
import Label from '@/Components/Label';
import swal from 'sweetalert2';
import ApiService from '@/services/ApiService';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import { Modal } from '@mui/material';
import { Inertia } from '@inertiajs/inertia';
import "quill-mention";

const AddPost = (props) => {
  const open = true;
  const configs = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const [errors, setErrors] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  // var [content, setContent] = useState('');
  const reactQuillRef = useRef();
  const [disable, setDisable] = useState(true);
  const [tagdata, setTagData] = useState([]);
  var content = "";
  const changeHandler = (event) => {
    setSelectedFile(event.target.files);
    setDisable(false);

  };

  const onHandleChange = (value) => {
    content = value;
    // setContent(value);
    setDisable(false);

  };

  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer);
      toast.addEventListener('mouseleave', swal.resumeTimer);
    },
  });



  const mentionModule = {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: function(searchTerm, renderList, mentionChar) {
        let values;
        if (mentionChar === "@") {
          values = tagdata && tagdata.map((student) => ({ id: student.id, value: student.first_name + student.last_name + " " , avatar_original: student.avatar_original}));
        }
        
        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
          var els = document.getElementsByClassName("pointer-events-none");
          Array.prototype.forEach.call(els, function(el) {
              el.parentElement.classList.add("disable-heading");
          });
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
          var els = document.getElementsByClassName("pointer-events-none");
          Array.prototype.forEach.call(els, function(el) {
              el.parentElement.classList.add("disable-heading");
          });
        }
      },
      renderItem(item){
        if(!item.avatar_original){
          return `<div class="${item.id !=0 ? 'flex items-center' : 'pointer-events-none font-bold'}">
                  <span class="w-8 h-8 mr-2 relative flex justify-center items-center rounded-full text-xl text-white uppercase bg-yellow-500 ${item.id !=0 ? '' : 'hidden'}">${item.value.charAt(0)}</span>
                  <span>${item.value}</span> 
                </div>`
        }else{
        return `<div class="${item.id !=0 ? 'flex items-center' : 'pointer-events-none font-bold'} ">
          <span class="mr-2 relative flex justify-center items-center w-8 h-8 rounded-full bg-yellow-500"><img src="${item.avatar_original}" class="object-cover w-8 h-8 rounded-full"></span>
          <span>${item.value}<span>
        </div>`;
        }
      }
  }

  const SaveData = (event) => {
    setDisable(true);
    const formData = new FormData();
    if (selectedFile) {
      for (let i = 0; i < selectedFile.length; i++) {
  
        const bytesToMegaBytes = (bytes) => bytes / 1024 ** 2;
        if (bytesToMegaBytes(selectedFile[i].size) > 8.1) {
          swal.fire({
            icon: 'error',
            html: 'File should not be greater than 8 MB',
          });
          setErrors('');
          return true;
        }
        if (selectedFile[i].type.toString().includes('video')) {
          swal.fire({
            icon: 'error',
            html: 'File should be an Image',
          });
          setErrors('');
          return true;
        }
        if (!selectedFile[i].type.toString().includes('jpeg') && !selectedFile[i].type.toString().includes('png')) {
          swal.fire({
            icon: 'error',
            html: 'File type should be png, jpeg or jpg',
          });
          setErrors('');
          return true;
        }
        formData.append(`image[${i}]`, selectedFile[i]);
      }
    }
    const regex = /(<\/?span[^>]*>)/gi;
    formData.append('desc', content ? content.replace(regex, '') : '');
    if(content.toString().includes('href'))
    formData.append('desc', content ? content.replace('href="', 'href="https://') : '');

    event.preventDefault();
    axios
      .get(route('checkwords'), {
        params: {
          desc: content,
        },
      })
      .then((rsp) => {
        if (rsp.data.status == 'error') {
          const sent = rsp.data.html;
          const div = document.createElement('div');
          const quill = new Quill(div);
          quill.clipboard.dangerouslyPasteHTML(sent);
          const result = quill.root.innerHTML;

          swal.fire({
            icon: 'error',
            html: `Please remove inappropriate words such as ${rsp.data.props}. ${rsp.data.message}`,
          });

          content = result;
        } else {
          ApiService.post(route('post.store'), formData, configs)
            .then((response) => {
              if (response.data.status === 'failed') {
                setErrors(response.data.errors);
              } else if (response.data.status !== 'error') {
                props.closeModel();
                window.top.location.href.toString().includes('home') && Inertia.visit(route('student.home'));
                window.top.location.href.toString().includes('post') && Inertia.visit(route('student.posts'));

                Toast.fire({
                  icon: 'success',
                  title: '  ',
                  html: "<p class='text-lg'>Post Added successfully</p>",
                });
              }
            })
            .catch((err) => {
              if (err.response.status === 422) {
                setErrors(err.response.data.errors);
              }
            });
        }
      });
  };

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('student.post.tagSomeone')).then((res) => {
        setTagData(res.data.tagdata);
      });
      };
    fetchData();
  }, []);

  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div className="d-flex w-full justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl m-2">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-auto md:w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-black-800 text-xl font-bold">Add Post</h3>
            </div>
            <div className="relative p-6 flex-auto">
              <div className="mb-3">
                <Label forInput="images" value="Upload Image" />
                <input
                  type="file"
                  onChange={changeHandler}
                  name="image"
                  multiple
                  accept="image/png,image/jpg,image/jpeg"
                />
                {errors.image && <div className="text-red-500 text-sm w-96">{errors.image}</div>}
              </div>

              <div className="w-full">
                <Label forInput="slug" value="Caption" />

                <ReactQuill
                  className="h-48"
                  ref={reactQuillRef}
                  theme="snow"
                  value={content}
                  onChange={onHandleChange}
                  modules={{mention: mentionModule}}
                />
              </div>
              {errors.desc && <div className="text-red-500">{errors.desc}</div>}
            </div>

            <div className="mt-10 md:mt-6 flex items-center justify-end p-6 border-solid border-blueGray-200 rounded-b">
              <button
                className={`${
                  disable == true && 'cursor-not-allowed opacity-50'
                } ml-2 flex-shrink-0 text-sm text-blue-600 py-2 px-4 font-semibold rounded-full border border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none ease-linear transition-all`}
                type="button"
                onClick={SaveData}
                disabled={disable}
              >
                Share Post
              </button>
              <button
                className="ml-2 px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                type="button"
                onClick={() => props.closeModel()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddPost;
