import { Page, Locator } from '@playwright/test';

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

  async continue() {
    await this.continueButton.click();
  }
}