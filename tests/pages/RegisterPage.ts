import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly caregiverOption: Locator;
  readonly patientOption: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly createAccountBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.caregiverOption = page.getByRole('link', { name: 'Get Started' }).nth(1);
    this.patientOption = page.getByRole('link', { name: 'Get Started' }).first();
    this.fullNameInput = page.getByLabel('Full Name', { exact: true });
    this.emailInput = page.getByLabel('Work Email', { exact: true });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.confirmPasswordInput = page.getByLabel('Confirm Password', { exact: true });
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });
  }

  async navigate() {
    await this.page.goto('/register');
  }

  async chooseCaregiverRole() {
    await this.caregiverOption.click();
  }

  async choosePatientRole() {
    await this.patientOption.click();
  }

  async fillDetails(values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.fullNameInput.fill(values.name);
    await this.emailInput.fill(values.email);
    await this.passwordInput.fill(values.password);
    await this.confirmPasswordInput.fill(values.confirmPassword);
  }

  async submit() {
    await this.createAccountBtn.click();
  }
}
