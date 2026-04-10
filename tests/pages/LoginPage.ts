import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly formMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Work Email', { exact: true });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.loginBtn = page.getByRole('button', { name: 'Sign In to Portal' });
    this.formMessage = page.getByRole('status');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, pass: string) {
    await expect(this.emailInput).toBeEditable();
    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);

    await expect(this.passwordInput).toBeEditable();
    await this.passwordInput.fill(pass);
    await expect(this.passwordInput).toHaveValue(pass);

    await this.loginBtn.click();
  }

  async submitEmptyForm() {
    await this.loginBtn.click();
  }
}