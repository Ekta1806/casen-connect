import ReadMore from '@/Components/ReadMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect, useState } from 'react';
import Index from '../Dashboard/Index';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import DoneIcon from '@mui/icons-material/Done';
import { Tab } from '@headlessui/react';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function List(props) {
  const [isBottom, setIsBottom] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(props.answeredQuestions.data);
  const [missedQuestions, setmissedQuestions] = useState(props.missedQuestions.data);
  const [pageNo, setPageNo] = useState(props.answeredQuestions.next_page_url);
  const [pageNoOne, setPageNoOne] = useState(props.missedQuestions.next_page_url);

  const handleScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

    if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
      setIsBottom(true);
    }
  };

  const getData = () => {
    axios.get(`${pageNo}&type=page`).then((res) => {
      setAnsweredQuestions((old) => [...old, ...res.data.answeredQuestions.data]);
      setIsBottom(false);
      setPageNo(res.data.answeredQuestions.next_page_url);
    });
  };

  const missedQueData = () => {
    axios.get(`${pageNoOne}&type=page`).then((res) => {
      setmissedQuestions((old) => [...old, ...res.data.missedQuestions.data]);
      setIsBottom(false);
      setPageNoOne(res.data.missedQuestions.next_page_url);
    });
  };

  useEffect(() => {
    document.title = 'Review Questions';
    if (isBottom) {
      if (pageNo != null) {
        getData();
      }
      if (pageNoOne != null){
        missedQueData();
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBottom]);

  return (
    <Index header={'Review Questions'}>
      <div className="flex flex-wrap mt-0 md:mt-4">
        <div className="w-full px-0 md:px-4">
          <div className="relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t bg-white mb-0 px-4 py-4">
              <div className="text-center flex justify-between">
                <h6 className="text-lg font-semibold text-black-500 capitalize">Past questions</h6>
              </div>
            </div>
            <Tab.Group>
              <Tab.List className="mx-2 my-4 mt-0 flex space-x-1 rounded-full bg-blue-600 p-1 sticky z-10">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-auto rounded-full p-3 text-sm font-semibold uppercase leading-5 text-white',
                      'hover:bg-gray-300',
                      selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                    )
                  }
                >
                  Attended Question
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-auto rounded-full p-3 text-sm font-semibold uppercase leading-5 text-white',
                      'hover:bg-gray-300',
                      selected ? 'bg-yellow-500' : 'text-white hover:bg-yellow-500 hover:text-white',
                    )
                  }
                >
                  Missed Question
                </Tab>
              </Tab.List>
              <Tab.Panels className="bg-gray-100 px-2 rounded-b">
                <Tab.Panel className="overflow-y-auto max-h-full">
                  <div className="m-0 relative px-2 bg-gray-100">
                    {answeredQuestions.length ? (
                      answeredQuestions.map((answer, index) => (
                        <div
                          key={index}
                          className="item-center my-6 md:my-12 p-4 mx-auto bg-white rounded-xl shadow-md md:max-w-2xl"
                        >
                          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              {answer.answer_approved == null && 
                                <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold inline-flex items-center p-1.5 rounded-full">
                                  <AccessTimeIcon className="" />
                                </span>
                              }
                              {answer.answer_approved == 1 && 
                                <span className="bg-green-100 text-green-800 text-sm font-semibold inline-flex items-center p-1.5 rounded-full">
                                  <DoneIcon className="" />
                                </span>
                              }
                              {answer.answer_approved == 0 && 
                                <span className="bg-red-100 text-red-800 text-sm font-semibold inline-flex items-center p-1.5 rounded-full">
                                  <ThumbDownOffAltIcon className="" />
                                </span>
                              }
                            </div>

                            <div className="flex justify-end mt-2 sm:mt-0 bg-purple-100 min-w-auto md:min-w-max lozenge items-center text-sm font-semibold rounded py-1 px-2">
                              <AccessTimeIcon className="w-12 mr-1" />
                              <span className="">
                                {' '}
                                Answered On{' '}
                                {new Date(answer.created_at).toLocaleDateString('en-US', {
                                  hour12: false,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <p className="w-full text-left text-base sm:text-lg font-bold text-black-600 mb-1">
                            Q. {answer.question_content}
                          </p>

                          {answer.desc_answer ? (
                            <div className="mt-0 text-left">
                              <ReadMore>{answer.desc_answer}</ReadMore>
                            </div>
                          ) : (
                            <div className="mt-6 mb-6 flex flex-wrap">
                              <div
                                className={` rounded-lg mb-2 flex items-start w-1/2 ${
                                  answer.option_answer == 'Option 1' ? ' bg-green-300' : ''
                                }`}
                              >
                                <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                                <span className="text-md text-dark-2 py-1">{answer.options.answers.option_1}</span>
                              </div>
                              <div
                                className={` rounded-lg mb-2 flex items-start w-1/2 ${
                                  answer.option_answer == 'Option 2' ? ' bg-green-300' : ''
                                }`}
                              >
                                <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                                <span className="text-md text-dark-2 py-1">{answer.options.answers.option_2}</span>
                              </div>
                              <div
                                className={`rounded-lg mb-2 flex items-start w-1/2 ${
                                  answer.option_answer == 'Option 3' ? ' bg-green-300' : ''
                                }`}
                              >
                                <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                                <span className="text-md text-dark-2 py-1">{answer.options.answers.option_3}</span>
                              </div>
                              <div
                                className={`rounded-lg mb-2 flex items-start w-1/2 ${
                                  answer.option_answer == 'Option 4' ? ' bg-green-300' : ''
                                }`}
                              >
                                <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                                <span className="text-md text-dark-2 py-1">{answer.options.answers.option_4}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-600  text-lg flex justify-center w-full my-8">
                        <div className="bg-white rounded-t rounded-b p-4 text-center">
                          You haven`t solve any question yet.
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="m-0 relative px-2 bg-gray-100">
                    {missedQuestions.length ? (
                      missedQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="item-center my-6 md:my-12 p-4 mx-auto bg-white rounded-xl shadow-md md:max-w-2xl"
                        >
                          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              {question.question_details.content && 
                                <span className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded-full">
                                  <ContactSupportOutlinedIcon className="text-blue-600" />
                                </span>
                              }
                            </div>

                            <div className="flex justify-end mt-2 sm:mt-0 bg-purple-100 min-w-auto md:min-w-max lozenge items-center text-sm font-semibold rounded py-1 px-2">
                              <AccessTimeIcon className="w-12 mr-1" />
                              <span className="">
                                {new Date(question.ask_on_date).toLocaleDateString('en-US', {
                                  hour12: false,
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          <p className="w-full text-left text-base sm:text-lg font-bold text-black-600 mb-1">
                            Q. {question.question_details.content}
                          </p>
                          {question.question_details.answers && question.question_details.type !== 'descriptive' ? (
                            <div className="mt-6 mb-6 flex flex-wrap">
                            <div
                              className={`rounded-lg mb-2 flex items-start w-1/2`}
                            >
                              <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                              <span className="text-md text-dark-2 py-1">{question.question_details.answers.option_1}</span>
                            </div>
                            <div
                              className={`rounded-lg mb-2 flex items-start w-1/2`}
                            >
                              <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                              <span className="text-md text-dark-2 py-1">{question.question_details.answers.option_2}</span>
                            </div>
                            <div
                              className={`rounded-lg mb-2 flex items-start w-1/2`}
                            >
                              <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                              <span className="text-md text-dark-2 py-1">{question.question_details.answers.option_3}</span>
                            </div>
                            <div
                              className={`rounded-lg mb-2 flex items-start w-1/2`}
                            >
                              <span className="w-4 h-4 rounded-full my-1 mr-2 relative flex-shrink-0 bg-dark-6"></span>
                              <span className="text-md text-dark-2 py-1">{question.question_details.answers.option_4}</span>
                            </div>
                          </div>
                          ) : (
                            <div className="mt-0 text-left">
                              
                            </div>
                          )}

                        </div>
                      ))
                    ) : (
                      <div className="text-gray-600  text-lg flex justify-center w-full my-8">
                        <div className="bg-white rounded-t rounded-b p-4 text-center">
                          You haven`t any missed question yet.
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </Index>
  );
}
