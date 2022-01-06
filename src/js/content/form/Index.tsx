import React, { FC, useEffect, useState } from 'react';

import { MESSAGE_LISTENER_TYPES } from '../../utils/constants';
import { ProcessVideo } from '../../interfaces';
import classNames from 'classnames';
import root from 'react-shadow';
import tailwindStle from '../../../css/tailwind.css';

const Form: FC = () => {
  const [showForm, setShowForm] = useState(true);
  const [firstNameValue, setFirstNameValue] = useState<string>('');
  const [composeId, setComposeId] = useState<string>();

  const submitHandler = () => {
    console.log({ firstNameValue });

    if (!composeId) {
      alert('Form not loaded. Refresh this form');
      return;
    }

    const data: ProcessVideo[] = [
      {
        first_name: firstNameValue,
        last_name: 'Apple',
        email: 'post@seen.io',
        phone: '+4700000000',
        customer_id: composeId,
      },
    ];

    chrome.runtime.sendMessage(
      {
        type: MESSAGE_LISTENER_TYPES.PROCESS_VIDEO,
        data,
      },
      (response: any) => {
        console.log(response);
      },
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('composeId');
    if (id) {
      setComposeId(id);
    }
  }, []);

  useEffect(() => {
    setShowForm(true);
  }, [composeId]);

  return (
    <>
      {showForm && (
        <root.div className="quote">
          <style type="text/css">{tailwindStle}</style>

          <div className={classNames({ show: showForm }, { hide: !showForm })}>
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
            <div>
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
