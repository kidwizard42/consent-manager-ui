import type { AirgapAPI, TranscendAPI } from 'src/@types/airgap.js';
import { airgapInit, transcendInit } from './config';
import { showConsentManager } from './ui';
// import { showConsentManager } from './ui2';

export const getAirgap = (): Promise<AirgapAPI> =>
  new Promise((resolve) => {
    const airgap = (airgapInit || {
      readyQueue: [],
      ready(callback: (airgap: AirgapAPI) => void) {
        if (this.readyQueue) {
          this.readyQueue.push(callback);
        }
      },
    }) as AirgapAPI;

    if (!airgapInit) {
      window.airgap = airgap;
    }

    airgap.ready((api: AirgapAPI) => {
      resolve(api);
    });
  });

export const init = async () => {
  const { readyQueue = [] } = transcendInit || {};
  if (transcendInit && readyQueue) {
    delete transcendInit.readyQueue;
    console.log('transcend.ready() queue = [', readyQueue, ']');
  }

  const transcend = {
    ...transcendInit,
    readyQueue: [],
    ready(callback: (transcend: TranscendAPI) => void) {
      callback(transcend);
    },
    showConsentManager,
  } as TranscendAPI;

  window.transcend = transcend;

  await getAirgap();

  if (readyQueue) {
    // Process ready() queue
    readyQueue.forEach((callback: (transcend: TranscendAPI) => void) => {
      try {
        callback(transcend);
      } catch (ex) {
        setTimeout(() => {
          throw ex;
        }, 0);
      }
    });
    readyQueue.length = 0;
  }

  console.log('Consent Manager UI ready');
};
