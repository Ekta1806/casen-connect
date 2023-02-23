import Authenticated from '@/Layouts/Authenticated';
import { useState, useRef } from 'react';
import Button from '@/Components/Button';
import Label from '@/Components/Label';
import { Link, useForm } from '@inertiajs/inertia-react';
import swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "quill-mention";

export default function Create(props) {
  const { data, setData, reset } = useForm({
    images: null,
    classes_id: props.class.id,
    content: '',
  });
  var contentData = "";

  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [studentsoptions, setStudentsOptions] = useState([]);
  const reactQuillRef = useRef();
  const addPostImages = (pic) => {
    setData('postImages', pic);
    setSelectedFile(pic.target.files);
  };

  const back = (post) => {
    window.history.back();
  };

  const onHandleChange = (value) => {
    contentData = value;
  };

  const fetchStudents = async (e) => {
    data.classes_id = e.value;

    return await axios.post(route('admin.adminposts.tagSomeone'),{'class_id':`${e.value}`})
      .then((res) => {
        console.log(res.data.students);
        setStudentsOptions(res.data.students);
        return res.data.students;
      });
  };
  const mentionModule = {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: function(searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === "@") {
          values = studentsoptions && studentsoptions.map((student) => ({ id: student.id, value: student.first_name + student.last_name + " ",avatar_original: student.avatar_original }));
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
    data.content = contentData;
    const formPayLoad = new FormData(e.target);
    const regex = /(<\/?span[^>]*>)/gi;
    formPayLoad.set('classes_id', data.classes_id);
    formPayLoad.set(
      'content',
      data.content ? data.content.replace(regex, '') : '',
    );
    if(data.content.toString().includes('href'))
    formData.append('content', data.content ? data.content.replace('href="', 'href="https://') : '');
    if (data.postImages != null) {
      for (let i = 0; i < data.postImages.length; i++) {
        formData.append(`images[${i}]`, data.postImages[i]);
      }
    }

    axios
      .post(route('admin.adminposts.store'), formPayLoad)
      .then((response) => {
        setProcessing(false);
        swal.fire({
          title: 'Success !',
          text: response.data,
          icon: 'success',
        });
        window.history.back();
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);

        setErrors([]);
        reset();
        document.getElementById('formCreateAdminPost').reset();
        document.getElementById('textarea').value = '';
      })
      .catch((err) => {
        setProcessing(false);
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

  return (
    <Authenticated auth={props.auth} errors={props.errors} header={'Admin Posts'}>
      <div className="flex flex-wrap justify-center">
        <div className="w-full xl:w-3/5">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-4 md:mb-6 shadow-lg rounded-lg bg-gray-50 border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-left flex items-start md:items-center justify-between flex-col md:flex-row">
                <div className="w-full md:w-auto mb-2 md:mb-0 flex lg:justify-center justify-center items-start md:items-center flex-col lg:flex-row">
                  <h6 className="text-black-600 text-lg font-semibold capitalize">Add New Admin Post</h6>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => back()}
                    className="px-4 py-2 text-sm text-red-600 bg-red-200 font-semibold rounded-full border border-transparent hover:bg-red-600 hover:text-white focus:outline-none ease-linear transition-all"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
            <form onSubmit={submit} id="formCreateAdminPost">
              <div className="flex-auto px-4 lg:px-6 py-10 pt-0">
                <div className="flex flex-wrap space-y-4">
                  <div className="w-full lg:w-6/12 px-4 mt-4">
                    <Label forInput="classes_id" value="Select Class" required={true} />

                    {props.class.id ? (
                      <Select
                        options={props.classes}
                        value={props.classes.filter((option) => option.label == props.class.name)}
                        name="classes_id"
                        isDisabled
                      />
                    ) : (
                      <Select
                        options={props.classes}
                        name="classes_id"
                        onChange={(e) => {
                          setData('classes_id', e.value);
                          fetchStudents(e);}
                        }
                      />
                    )}

                    {errors.classes_id && <div className="text-sm text-red-600">{errors.classes_id}</div>}
                  </div>

                  <div className="w-full lg:w-6/12 px-4 mt-4">
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
                    <Label forInput="content" value="Content" required={true} />

                    <ReactQuill
                      className="bg-white"
                      ref={reactQuillRef}
                      theme="snow"
                      name="content"
                      value={contentData}
                      onChange={onHandleChange}
                      modules={{mention: mentionModule}}
                    />

                    {errors.content && <div className="text-sm text-red-600">{errors.content}</div>}
                  </div>
                </div>
                <div className="text-right mt-2">
                  <Button
                    className="inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all"
                    processing={processing}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
