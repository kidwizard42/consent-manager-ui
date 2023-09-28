import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { config } from './config';
import { getAirgap } from './init';
import logo from '../settings.svg';
import help from '../help.svg';
import './ui.css';
import type {
  TrackingConsent,
  TrackingPurposesTypes,
} from 'src/@types/airgap.js';
import Slider from './slider';

let initialized = false;
// UI root node in DOM
let root: Element | undefined;

enum commonConstants {
  hide = 'hide',
  ConsentManager = 'ConsentManager',
}

const setupConsentManagerUI = async (): Promise<void> => {
  console.log('Initializing Consent Manager UI...');

  const airgap = await getAirgap();

  console.log('Purpose types config:', airgap.getPurposeTypes());
  console.log('Consent Manager UI config:', config);

  initialized = true;
  console.log('Consent Manager UI initialized');
};

export const showConsentManagerUI = async () => {
  const airgap = await getAirgap();

  const currentConsent = airgap.getConsent()?.purposes;
  const purposeTypes = airgap.getPurposeTypes();
  const essentialPurposeTypes: TrackingPurposesTypes = {};
  const nonEssentialPurposeTypes: TrackingPurposesTypes = {};

  const denyAll: TrackingConsent = {
    Functional: false,
    Analytics: false,
    Advertising: false,
    SaleOfInfo: false,
  };
  const acceptAll: TrackingConsent = {
    Functional: true,
    Analytics: true,
    Advertising: true,
    SaleOfInfo: true,
  };

  console.log('Current consent:', airgap.getConsent());

  // fills two objects that will be mapped to build the modal
  for (const pt in purposeTypes) {
    if (purposeTypes[pt].essential && purposeTypes[pt].description !== '') {
      essentialPurposeTypes[pt] = purposeTypes[pt];
    } else if (
      !purposeTypes[pt].essential &&
      purposeTypes[pt].description !== ''
    ) {
      nonEssentialPurposeTypes[pt] = purposeTypes[pt];
    }
  }

  const UIManager: React.FC = () => {
    const [isChecked, setIsChecked] = useState(currentConsent);
    const wrapper = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      const manager = document.getElementById(commonConstants.ConsentManager);

      if (manager?.classList.contains(commonConstants.hide)) {
        return;
      }

      if (wrapper.current && !wrapper.current?.contains(targetNode)) {
        // set slider configuration back to local storage version before modal hides
        const consent = airgap.getConsent()?.purposes;
        setIsChecked(consent);
        manager?.classList.add(commonConstants.hide);
      }
    };

    const hideModal = () => {
      root?.classList.add(commonConstants.hide);
    };

    useEffect(() => {
      // without the third option as true, the event listener always fires AFTER the button's logic. results in being unable to open the modal ever.
      document.addEventListener('click', handleClickOutside, true);

      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }, []);

    return (
      <>
        <section ref={wrapper}>
          <p className="learnMoreAndCloseXButton">
            <a href="https://example.com/">
              <b>
                {`<`} {config.learnMoreLink}
              </b>
            </a>
            <span
              id="close"
              aria-label={config?.closeButtonAriaLabel}
              onClick={() => {
                // set slider configuration back to local storage version before modal hides
                const consent = airgap.getConsent()?.purposes;
                setIsChecked(consent);
                hideModal();
              }}
            >
              X
            </span>
          </p>
          <img src={logo} alt="settings logo" className="settingsLogo" />
          <header>
            <h2>{config.consentManagerTitle}</h2>
          </header>
          <pre className="configBody">{config?.body}</pre>
          <ul className="nonEssentialPurposeTypes">
            {Object.keys(nonEssentialPurposeTypes).map((key: string, i) => {
              return (
                <li key={i} className="nonEssentialLI">
                  <Slider
                    checked={isChecked[key]}
                    nonEssentialPurposeType={nonEssentialPurposeTypes[key]}
                    src={help}
                    alt="description of checkbox"
                  />
                  {/* <label className="switch">
                    <input
                      type="checkbox"
                      checked={isChecked[key]}
                      onChange={(e) => {
                        setIsChecked({
                          ...isChecked,
                          [key]: !isChecked[key],
                          SaleOfInfo: isChecked?.Analytics,
                        });
                      }}
                    ></input>
                    <span className="slider round"></span>
                  </label>
                  <span className="sliderText">
                    {nonEssentialPurposeTypes[key]?.name}{' '}
                    <div className="tooltip">
                      <img src={help} alt="description of checkbox" />
                      <span className="tooltipText">
                        {nonEssentialPurposeTypes[key]?.description}
                      </span>
                    </div>
                  </span> */}
                </li>
              );
            })}
          </ul>
          <p>{config.requiredDisclosuresHeader}</p>
          <ul className="configRequiredText">
            {Object.keys(essentialPurposeTypes).map((key, i) => {
              return (
                <li key={i}>
                  <b> {essentialPurposeTypes[key]?.name}: </b>
                  {essentialPurposeTypes[key]?.description}
                </li>
              );
            })}
          </ul>
          <button
            id="acceptAllButton"
            onClick={(e) => {
              airgap.optIn(e.nativeEvent);
              setIsChecked(acceptAll);
              hideModal();
            }}
          >
            Accept All
          </button>
          <button
            id="savePreferencesButton"
            onClick={(e) => {
              airgap.setConsent(e.nativeEvent, isChecked);
              hideModal();
            }}
          >
            {config.primaryButtonLabel}
          </button>
          <button
            id="denyAllButton"
            onClick={(e) => {
              airgap.optOut(e.nativeEvent);
              setIsChecked(denyAll);
              hideModal();
            }}
          >
            Deny All
          </button>
        </section>
      </>
    );
  };

  root = document.createElement('div');
  root.className = commonConstants.ConsentManager;
  root.id = commonConstants.ConsentManager;
  ReactDOM.render(
    <React.StrictMode>
      <UIManager />
    </React.StrictMode>,
    root,
  );
  document.body.firstElementChild?.before(root);
};

export const showConsentManager = async () => {
  console.log('transcend.showConsentManager() called');
  if (!initialized) {
    await setupConsentManagerUI();
  }

  let manager = document.getElementById(commonConstants.ConsentManager);

  // At super small sizes the modal wont cover the "Data Collection..." button. As of now an outside click on that button won't hide the modal but I'm assuming that's fine. Can change the logic if that is preferred.
  if (manager) {
    manager.classList.remove(commonConstants.hide);
  } else {
    await showConsentManagerUI();
  }
};
