import Authenticated from '@/Layouts/Authenticated';
import { useState, useRef,useEffect } from 'react';
import Button from '@/Components/Button';
import ApiService from '@/services/ApiService';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Inertia } from '@inertiajs/inertia';
import "quill-mention";

export default function Edit(props) {
  const { data, setData, post, reset } = useForm({
    images: null,
    classes_id: props.post.classes_id,
    content: props.post.content,
  });
  const [content,setContent] = useState([]);

  const [studentsoptions, setStudentsOptions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const reactQuillRef = useRef();
  const [selectedFile, setSelectedFile] = useState();

  const regextag = /(@[a-z0-9]*)/gi;
  var contentData = data.content.replace(regextag,'<span class = "mention" data-index="0" data-denotation-char="" data-id="" data-value="$1 ">#xFEFF;<span contenteditable="false">$1</span>&#xFEFF;</span>');

  const addPostImages = (pic) => {
    setData('postImages', pic);
    setSelectedFile(pic.target.files);
  };

  const fetchStudents = async (e) => {
    data.classes_id = e.value;
    setData('content', '');
    return await axios.get(route('teacher.classPosts.tagSomeone', [`${e.value}`]))
      .then((res) => {
        setStudentsOptions(res.data.students);
        return res.data.students;
      });
  };

  const onHandleChange = (value) => {
    var data = value.replace( /(<([^>]+)>)/ig, '');
    if(data){
      contentData = value;
    }else{
      contentData = '';
    }
  };

  const mentionModule = {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: function(searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "@") {
          values = studentsoptions && studentsoptions.map((student) => ({ id: student.id, value: student.first_name + student.last_name + " ", avatar_original: student.avatar_original }));
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

  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);
    const formPayLoad = new FormData(e.target);
    const regex = /(<\/?span[^>]*>)/gi;
    formPayLoad.set('_method', 'PATCH');
    formPayLoad.set('classes_id', data.classes_id);
    data.content = contentData;
    formPayLoad.set(
      'content',
      data.content != "" ? data.content.replace(regex, '') : '',
    );
    if(data.content.toString().includes('href'))
    formData.append('content', data.content ? data.content.replace('href="', 'href="https://') : '');
    if (data.postImages != null) {
      for (let i = 0; i < data.postImages.length; i++) {
        formData.append(`images[${i}]`, data.postImages[i]);
      }
    }

    axios
      .post(route('teacher.classPosts.update', props.post.id), formPayLoad)
      .then((response) => {
        window.location.replace(route('teacher.classPosts'));
          setProcessing(false);
          setErrors([]);
          
          swal.fire({
            title: 'Success !',
            text: response.data,
            icon: 'success',
          });
          reset();
          document.getElementById('formEditClassPost').reset();
          document.getElementById('textarea').value = '';
      })
      .catch((err) => {
        setProcessing(false);
        console.log(err);
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
          for (let i = 0; i < selectedFile.length; i++) {
            if (err.response.data.errors[`images.${i}`] != undefined) {
              swal.fire({
                icon: 'error',
                html: err.response.data.errors[`images.${i}`][0].replace(`images.${i}`, 'Image'),
              });
              return true;
            }
          }
        }
      });
  };

  useEffect(() => {
    const fetchData = () => {
      ApiService.get(route('teacher.classPosts.tagSomeone',[`${props.post.classes_id}`])).then((res) => {
        setStudentsOptions(res.data.students);
          return res.data.students;
      });
      };
    fetchData();
  }, []);

 

  const deletePostMedia = (e, post, media) => {
    e.preventDefault();
    swal.fire({
      title: 'Warning!',
      text: 'Are you sure you want to delete this class post media? Data cannot be retrieved once deleted.',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Yes! Delete',
      showDenyButton: true,
      denyButtonText: 'No! Cancel',
    }).then((chosenButton) => {
      if (chosenButton.isConfirmed) {
        axios.delete(route('teacher.classPosts.deleteMedia', [post.id, media.id])).then((response) => {
          swal.fire({
              title: 'Success !',
              text: response.data,
              icon: 'success',
            });
            Inertia.reload({props});
        });
      }
    });
  };

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Class Posts'}>
      <div className="flex flex-wrap">
        <div className="w-full">
          <form onSubmit={submit} id="formEditClassPost">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
              <div className="rounded-t bg-white mb-0 px-4 py-4">
                <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                  <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                    <h6 className="text-black-600 text-lg font-semibold capitalize">Edit Class Post</h6>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      className="inline-flex items-center px-4 py-2 text-sm text-white rounded-full bg-blue-600 font-semibold  border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all   "
                      processing={processing}
                    >
                      Update
                    </Button>
                    <Link
                      href={route('teacher.classPosts')}
                      className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full lg:w-6/12 px-4 mt-4">
                    <Label forInput="classes_id" value="Select Class" required={true} />

                    <Select
                      options={props.classes}
                      id="classes_id"
                      name="classes_id"
                      className="mt-1"
                      onChange={(e) => {
                        data.classes_id =  e.value;
                        fetchStudents(e,props.post.classes_id);
                      }
                      }
                      defaultValue={props.classes.filter((division) => division.value === props.post.classes_id)}
                    />

                    {errors.classes_id && <div className="text-sm text-red-600">{errors.classes_id}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <Label forInput="images" value="Upload Images" />

                    <input
                      type="file"
                      name="images[]"
                      id="images"
                      className="py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 mt-1 block w-full"
                      onChange={addPostImages}
                      multiple
                      accept="image/png,image/jpg,image/jpeg"
                    />

                    {errors.images && <div className="text-sm text-red-600">{errors.images}</div>}
                  </div>

                  <div className="w-full px-4">
                    <Label forInput="content" value="Content" required={true}/>
                    <ReactQuill
                      className="bg-white"
                      ref={reactQuillRef}
                      theme="snow"
                      name="content"
                      value={contentData}
                      onChange={(e) => {
                        onHandleChange(e);
                        setContent(e.value);
                      }}
                      modules={{mention: mentionModule}}
                    />

                    {errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
                  </div>


                </div>

                {props.post.media.length > 0 && (
                  <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-center mt-10 gap-6">
                    {props.post.media.map((photo, index) => (
                      <div className="flex flex-col items-center justify-center bg-white p-4" key={index}>
                        <img
                          className="rounded w-full"
                          src={photo.original_url}
                          alt={`Post id#${post.id} - media #${index + 1}`}
                        />

                        <Link
                          href="#"
                          as="button"
                          method="delete"
                          className="mt-2 px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent  hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                          onClick={(e) => deletePostMedia(e, props.post, photo)}
                        >
                          {' '}
                          Delete
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
