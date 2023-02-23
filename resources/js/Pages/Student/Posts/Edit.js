import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import { Link } from '@inertiajs/inertia-react';
import React, { useState, useRef, useEffect } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { Fab, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import swal from 'sweetalert2';
import { Inertia } from '@inertiajs/inertia';
import Index from '../Dashboard/Index';
import ApiService from '@/services/ApiService';

export default function Edit(props) {
  const [errors, setErrors] = useState([]);
  const [tagdata, setTagData] = useState([]);
  const [disable, setDisable] = useState(true);
  var content = props.post.desc;

  const onHandleChange = (value) => {
    content = value;
    setDisable(false);
  };
  const regextag = /(@[a-z0-9]*)/gi;
  var defaultValue = content.replace(regextag,'<span class = "mention" data-index="0" data-denotation-char="" data-id="" data-value="$1 ">#xFEFF;<span contenteditable="false">$1</span>&#xFEFF;</span>');
  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files);
    setDisable(false);
  };

  const reactQuillRef = useRef();

  React.useEffect(() => {
    document.title = props._pageTitle;
    onHandleChange();
  }, []);

  const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 3000,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer);
      toast.addEventListener('mouseleave', swal.resumeTimer);
    },
  });

  const deleteRecord = (e, action) => {
    e.preventDefault();
    swal
      .fire({
        title: 'Are you sure?',
        text: 'You wont be able to revert this!',
        target: '#custom-target',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF0000',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          container: 'position-absolute',
        },
        toast: true,
        position: 'bottom-center',
      })
      .then((chosenButton) => {
        if (chosenButton.isConfirmed) {
          axios.delete(action).then(() => {
            Toast.fire({
              icon: 'success',
              title: '',
              html: "<p class='text-lg'>Deleted successfully</p>",
            });
            Inertia.reload(props.post);
          });
        }
      });
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const back = (post) => {
    window.top.location.href.toString().includes('profile') && Inertia.visit(route('members.profile', post.created_by));
    window.top.location.href.toString().includes('editmyposts') && Inertia.visit(route('student.posts'));
    window.top.location.href.toString().includes('editposts') && Inertia.visit(route('student.home'));
  };
  const mentionModule = {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    isOpen:true,
      mentionDenotationChars: ["@"],
      source: function(searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "@") {
          values = tagdata && tagdata.map((student) => ({ id: student.id, value: student.first_name + student.last_name + " "+ " " , avatar_original: student.avatar_original }));
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
  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('student.post.tagSomeone')).then((res) => {
        setTagData(res.data.tagdata);
      });
      };
    fetchData();
  }, []);

  const submit = (event, post) => {
    setDisable(true);
    const formData = new FormData();
    if (selectedFile) {
      for (let i = 0; i < selectedFile.length; i++) {
        formData.append(`image[${i}]`, selectedFile[i]);
      }
    }
    formData.set('_method', 'PATCH');
    const regex = /(<\/?span[^>]*>)/gi;
    formData.append('desc', content ? content.replace(regex, '') : '');
    if(content.toString().includes('href'))
    formData.append('desc', content ? content.replace('href="','href="https://') : '');
    formData.set('post_id', props.post.id);
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
          axios
            .post(route('post.update', props.post.id), formData, config)
            .then(() => {
                window.top.location.href.toString().includes('profile') && Inertia.visit(route('members.profile', post.created_by));
                window.top.location.href.toString().includes('editmyposts') && Inertia.visit(route('student.posts'));
                window.top.location.href.toString().includes('editposts') && Inertia.visit(route('student.home'));
                 
                Toast.fire({
                  icon: 'success',
                  title: '  ',
                  html: "<p class='text-lg'>Post updated successfully</p>",
                });
            })
            .catch((err) => {
              if (err.response.status === 422) {
                setErrors(err.response.data.errors);
                for (let i = 0; i < selectedFile.length; i++) {
                  if (err.response.data.errors[`image.${i}`] != undefined) {
                    swal.fire({
                      icon: 'error',
                      html: err.response.data.errors[`image.${i}`][0].replace(`image.${i}`, 'Image'),
                    });
                    return true;
                  }
                }
              }
            });
        }
      });
  };

  return (
    <div>
      <Index header={'Edit Posts'}>
        <div className="flex flex-wrap">
          <div className="w-full mb-12 px-0 md:px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-center flex justify-between">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Post</h6>
                </div>
              </div>

              <div className="relative p-6 flex-1">
                <label htmlFor="upload-photo">
                  <input
                    hidden
                    id="upload-photo"
                    name="image"
                    onChange={changeHandler}
                    type="file"
                    multiple
                    accept="image/jpeg, image/jpg, image/png"
                  />
                  <Fab color="primary" size="small" component="span" aria-label="add" variant="extended" className="">
                    <AddIcon /> Upload more photos
                  </Fab>
                </label>
                {errors.image && <div className="text-red-500 text-sm w-96">{errors.image}</div>}
              </div>

              <div className="relative p-6 flex-1">
                <ImageList variant="masonry" cols={3}>
                  {props.media.map((item) => (
                    <ImageListItem key={item.id}>
                      <img
                        className=""
                        alt = "images"
                        src={`${item.original_url}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${item.original_url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        className="bg-transparent custom-edit-post-img"
                        position="top"
                        actionIcon={
                          <Link
                            onClick={(e) => deleteRecord(e, route('media.destroy', item.id))}
                            href=""
                            as="button"
                            method="delete"
                            className="hover:text-white"
                          >
                            <DeleteOutlineIcon className="bg-red-100 text-red-600" />
                          </Link>
                        }
                        actionPosition="left"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </div>

              <div className="w-full p-4 md:p-6">
                <div className="flex-auto">
                  <div className="bg-transparent">
                    <ReactQuill
                      className="h-auto bg-transparent"
                      ref={reactQuillRef}
                      theme="snow"
                      defaultValue={defaultValue}
                      onChange={onHandleChange}
                      modules={{mention: mentionModule}}
                    />
                    {errors.desc && <div className="text-red-500">{errors.desc}</div>}
                  </div>
                </div>

                <div className="relative mt-10 flex justify-end space-x-2">
                  <button
                    className={`${
                      disable == true && 'cursor-not-allowed opacity-50'
                    }inline-flex items-center px-4 py-2 text-sm text-white font-semibold rounded-full bg-blue-600 border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all`}
                    type="button"
                    onClick={(e) => submit(e, props.post)}
                    disabled={disable}
                  >
                    Update Post
                  </button>
                  <button
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    onClick={(e) => back(props.post)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Index>
    </div>
  );
}
