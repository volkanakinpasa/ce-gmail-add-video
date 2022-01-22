import React, { FC, useEffect, useState } from 'react';

import { CampaignState } from '../enums';
import FormDialog from './form/FormDialog';
import { MESSAGE_LISTENER_TYPES } from '../utils/constants';

const FormApp: FC = (): JSX.Element => {
  const [campaignState, setCampaignState] = useState<CampaignState>(
    CampaignState.NONE,
  );
  const [tabId, setTabId] = useState<string>();

  const updateCurrentState = (state: CampaignState) => setCampaignState(state);

  const initCampaign = (tabIdParam: string): void => {
    updateCurrentState(CampaignState.INIT);

    setTabId(tabIdParam);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (message) => {
      switch (message.type) {
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_INIT:
          initCampaign(message.tabId);
          break;
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_STARTED:
          setCampaignState(CampaignState.STARTED);
          break;
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_IN_PROGRESS:
          setCampaignState(CampaignState.IN_PROGRESS);
          break;
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_DONE:
          setCampaignState(CampaignState.DONE);
          break;
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_SUCCESS:
          setCampaignState(CampaignState.SUCCESS);
          break;
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_FAILED:
          setCampaignState(CampaignState.FAILED);
          break;
        case MESSAGE_LISTENER_TYPES.CAMPAIGN_CANCEL:
          setCampaignState(CampaignState.NONE);
          break;
      }
    });
  }, []);

  return (
    <>
      {campaignState !== CampaignState.NONE && (
        <FormDialog tabId={tabId} campaignState={campaignState} />
      )}
    </>
  );
};

export default FormApp;
