import React, { useState, useEffect } from 'react';
import ApiService from '@/services/ApiService';
import Index from '../Dashboard/Index';

export default function News() {
  const [data, setdata] = useState([0]);

  useEffect(() => {
    ApiService.get(route('student.news')).then((res) => {
      setdata(res.data);
    });
  }, []);

  return (
    <>
       <Index header={'News'} className="bg-white">
        <div className="flex flex-wrap mt-0 md:mt-4 ">
          <div className="w-full mb-6 md:mb-12 px-0 md:px-4 ">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg bg-white border-1 border-blue-100">
              <div className="rounded-t mb-0 px-4 py-4">
                <div className="text-center flex justify-between">
                  <h6 className="flex items-center text-black-600 text-lg font-semibold capitalize">
                    {' '}
                    News
                    <img className="ml-2" alt="" width="38" height="38" src="/images/news.png" />
                  </h6>
                </div>
              </div>
              <div className="w-full border-t overflow-y-auto max-h-81">
                <div className="item-center p-3 m-4 mx-auto">
                  {data.news &&
                    data.news.map((announce, index) => (
                      <div className="mb-4 bg-gray-50 p-3 rounded" key={index}>
                        <p className="uppercase font-semibold text-sm mb-2">News about {announce.title}</p>
                        <p className="mt-0 text-md text-gray-400 whitespace-pre-wrap">{announce.content}</p>
                        <p className="text-xs text-gray-600 uppercase mt-3 text-right">
                          {new Date(announce.created_at).toLocaleDateString('en-US', {
                            hour12: false,
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </p>
                      </div>
                    ))}
                  {data.news && data.news.length == 0 && (
                    <div className="mb-4 bg-gray-50 p-3 rounded">
                      <p className="uppercase text-sm text-center">NO News</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Index>
    </>
  );
}
