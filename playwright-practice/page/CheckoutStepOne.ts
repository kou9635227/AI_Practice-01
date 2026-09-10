import { Page, Locator } from '@playwright/test';
import { CheckoutStepTwoPage } from './CheckoutStepTwo';

export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipPostalCode: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.zipPostalCode = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async register(firstName: string, lastName: string, zipPostalCode: string) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.zipPostalCode.fill(zipPostalCode);
  }

  /** First Name / Last Name / Zip/Postal Codeを入力 */
  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.zipPostalCode.fill(postalCode);
  }

  /** 「Continue」をクリックし、CheckoutStepTwoPageを返す */
  async continue(): Promise<CheckoutStepTwoPage> {
    await this.continueButton.click();
    return new CheckoutStepTwoPage(this.page);
  }
}
