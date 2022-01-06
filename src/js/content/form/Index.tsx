import React, { FC, useEffect, useState } from 'react';

import classNames from 'classnames';
import root from 'react-shadow';
import style from './form.css';
import tailwindStle from '../../../css/index.css';

const Form: FC = () => {
  const [showDialog, setShowDialog] = useState(true);
  const [firstNameValue, setFirstNameValue] = useState<string>('');

  const submitHandler = () => {
    console.log({ firstNameValue });
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (message) => {
      if (message.type === 'video-is-in-process') {
      }
    });
  }, []);

  return (
    <>
      {showDialog && (
        <root.div className="quote">
          <style type="text/css">{style}</style>
          <style type="text/css">{tailwindStle}</style>

          <div
            className={classNames({ show: showDialog }, { hide: !showDialog })}
          >
            <div className="mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                placeholder="Firstname"
                value={firstNameValue}
                onChange={(e) => setFirstNameValue(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={submitHandler}
              >
                Submit
              </button>
            </div>
          </div>
        </root.div>
      )}
    </>
  );
};

export default Form;
