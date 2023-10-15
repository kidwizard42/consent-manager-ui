# Quick app overview:


## what is this app?
    - This app is similar to a cookie banner that pops up. Its to ask users their tracking preferences. 
    - you can find the online version of my work [here](https://strong-genie-e06688.netlify.app/)

## Things I want attention drawn to
    - Built from scratch. No outside components used like MUI (company bonus challenge)
    - Consent manager doesn't cause rerenders or gets destroyed and built each time its opened. (company requriement)
    - closes when clicked outside ( company requirement)
    - animations for the toggles
    - saved preferences persist after page refresh


## Below is the original Read me built by the company that issued me this challenge. Fell free to read their requirements and compare it to my work




# consent-manager-ui (company read me begins here)

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Setup

- Extract challenge ZIP file to a new directory and open the directory in Visual Studio Code (or the editor of your choice)
- Open a terminal in VS Code (Ctrl+\` on most keyboards)
- Enter `yarn && yarn start`. If you run into issues with `yarn`, you could try removing `yarn.lock` first and then run `yarn`.

## Background

Let's build a consent manager popup to manage user tracking consent! This is similar to those annoying cookie banners that you've probably already seen all over web, though hopefully less annoying. This cookie banner won't be displayed immediately. Instead, its display can be deferred to a time when user is more invested in engaging with the site, which in this case means when they click the `Data Collection Preferences` button.

Let's build the following features:

- Build a ES module that defines a `transcend.showConsentManager()` method to generate and display a consent manager UI:
  - Present a React-based consent management UI that exposes all data from `airgap.getPurposeTypes()` and `airgap.getConsent()` in an intuitive manner.
    - This should display the stored consent values after reopening the modal and after page reload
    - Hint: airgap entirely manages the consent state for you, including persisting across page reloads!
  - Auto-close/hide the consent manager UI when the user defocuses/clicks outside of the consent manager UI
  - Write consent back to Transcend Consent Manager using the `airgap.setConsent()` API.
    - `airgap.setConsent()` returns `true` upon successful save
    - Hint: a common issue that causes it to return `false` is passing in a `ReactMouseEvent` instead of a native JS `MouseEvent`. This can be fixed by passing in `event.nativeEvent` instead of just the `event` that comes from `onClick` or other react handlers
  - `transcend.showConsentManager()` shouldn't re-create new DOM on every invocation.
  - Add 'accept all' / 'deny all' buttons (`airgap.optIn()` / `airgap.optOut()`)

You can find more information about all the relevant `airgap.js` APIs in our [docs here](https://docs.transcend.io/docs/consent/reference/api).

Bonus Challenges

- 1. Solution doesn't request other external resources than what is provided
- 2. Consent manager UI correctly displays when `transcend.showConsentManager()` is enqueued prior to your UI script loading.
- 3. Maintains reliability in the face of a third party script interfering with the consent manager DOM tree. This exposes the consent manager to the real-world scenario of the DOM being cleared in an SPA app.

We will evaluate your solution using the following rubric:
| Criteria | Below Expectations | Meets Expectation | Exceeds Expectations |
| ----------- | ----------- | ----------- | ----------- |
| Completeness | Basic functionality does not work, and/or has many bugs (e.g. new DOM is created on every invocation). | Implements the basic functionality without bugs. | Implements the basic functionality and at least one of the bonus challenges. |
| UX | The modal is difficult to understand and use. Glaring UI problems with uneven spacing, typos, low contrast colors, etc. | Implements the example UI given in this repo. | Implements an intuitive UI that's even better than the example -- the options are clear to the user. |
| Readability & Maintainability | Inconsistent syntax (ie did not use a linter). Poor function/variable names. | Used a linter. Easy to understand function/variable names. Has some test coverage for the happy path. | Follows best practices for writing React components. Modularized code. Leaves comments explaining non-obvious trade-offs/future breakage. Has thorough test coverage (includes unhappy paths).|

Reference screenshot (one potential theme that could be built):

![Reference screenshot](https://user-images.githubusercontent.com/46995/96355297-eb129580-1094-11eb-933f-fb3ca3a18090.png 'Screenshot of a reference consent manager UI design')

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

## Airgap API

### `airgap.getConsent(): TrackingConsent`

Returns the user's current tracking consent.

### `airgap.setConsent(interaction: AirgapAuth.interaction, consent: TrackingConsent, autoReload?: boolean): boolean`

Returns whether or not the user's tracking consent was able to be updated without a refresh. If CSP is active, a refresh is required to update enforcement of the user's tracking consent.

### `airgap.optIn(interaction: AirgapAuth.interaction, autoReload?: boolean): boolean`

Returns whether or not the user's tracking consent was able to be updated without a refresh. This function consents the user to all tracking purposes.

### `airgap.optOut(interaction: AirgapAuth.interaction, autoReload?: boolean): boolean`

Returns whether or not the user's tracking consent was able to be updated without a refresh. This function revokes consent for all tracking purposes.

### `airgap.getPurposeTypes(): TrackingPurposesTypes`

Returns the tracking purpose type configuration metadata. Example output:

```json
{
  "Functional": {
    "name": "Functionality",
    "description": "Personalization, autofilled forms, etc.",
    "defaultConsent": false,
    "showInConsentManager": true,
    "configurable": true,
    "essential": false
  },
  "Analytics": {
    "name": "Analytics + Performance",
    "description": "Help us learn how our site is used and how it performs.",
    "defaultConsent": false,
    "showInConsentManager": true,
    "configurable": true,
    "essential": false
  },
  "Advertising": {
    "name": "Targeting / Advertising",
    "description": "Helps us and others serve ads relevant to you.",
    "defaultConsent": false,
    "showInConsentManager": true,
    "configurable": true,
    "essential": false
  },
  "Essential": {
    "name": "Essential",
    "description": "",
    "defaultConsent": true,
    "showInConsentManager": false,
    "configurable": false,
    "essential": true
  },
  "Unknown": {
    "name": "Unknown",
    "description": "",
    "defaultConsent": false,
    "showInConsentManager": false,
    "configurable": false,
    "essential": false
  }
}
```

### `TrackingConsent`

An object consisting of tracking purpose types mapped to boolean consent statuses.

```ts
type TrackingConsent = {
  /** Consent to tracking for functional purposes */
  Functional?: boolean;
  /** Consent to tracking for advertising purposes */
  Advertising?: boolean;
  /** Consent to tracking for marketing and analytic purposes */
  Analytics?: boolean;
  /** Consent to tracking for essential purposes */
  Essential?: true;
  /** Unknown (unable to be consented) */
  Unknown?: false;
};
```
