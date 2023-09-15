import find from 'lodash/find';
import type { Driver } from '../driver-interfaces/driver';
import type { PiOpts } from '../platform-implementation';

export interface PersonDetails {
  fullName?: string;
  fullNameSortOrder?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export default class User {
  #driver: Driver;
  #piOpts: PiOpts;

  constructor(driver: Driver, piOpts: PiOpts) {
    this.#driver = driver;
    this.#piOpts = piOpts;
  }

  getEmailAddress() {
    return this.#driver.getUserEmailAddress();
  }

  isConversationViewDisabled() {
    return this.#driver.isConversationViewDisabled();
  }

  isUsingGmailMaterialUI() {
    this.#driver.getLogger().deprecationWarning('User.isUsingGmailMaterialUI');
    return true;
  }

  getLanguage() {
    return this.#driver.getUserLanguage();
  }

  getUserContact() {
    this.#driver
      .getLogger()
      .deprecationWarning('User.getUserContact', 'User.getEmailAddress');

    if (this.#piOpts.REQUESTED_API_VERSION !== 1) {
      throw new Error('This method was discontinued after API version 1');
    }

    return this.#driver.getUserContact();
  }

  getAccountSwitcherContactList() {
    this.#driver
      .getLogger()
      .deprecationWarning(
        'User.getAccountSwitcherContactList',
        'User.getEmailAddress',
      );
    let list = this.#driver.getAccountSwitcherContactList();
    const userEmail = this.getEmailAddress();
    const listHasUser = !!find(list, (item) => item.emailAddress === userEmail);

    if (!listHasUser) {
      // This happens for delegated accounts.
      list = list.concat([
        {
          name: userEmail,
          emailAddress: userEmail,
        },
      ]);
    }

    return list;
  }

  getPersonDetails(emailAddress: string): Promise<PersonDetails | undefined> {
    return this.#driver.getPersonDetails(emailAddress);
  }
}
