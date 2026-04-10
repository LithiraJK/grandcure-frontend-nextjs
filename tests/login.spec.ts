import { test, expect } from '@playwright/test';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

test.use({
  baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
});

const TEST_LOGIN_EMAIL = process.env.PW_TEST_LOGIN_EMAIL || 'test@grandcure.com';
const TEST_LOGIN_PASSWORD = process.env.PW_TEST_LOGIN_PASSWORD || 'ValidPass123!';
const TEST_INVALID_EMAIL = process.env.PW_TEST_INVALID_EMAIL || 'wronguser@gmail.com';
const TEST_INVALID_PASSWORD = process.env.PW_TEST_INVALID_PASSWORD || 'wrongpassword123';
const TEST_REGISTER_NAME = process.env.PW_TEST_REGISTER_NAME || 'Test Caregiver';
const TEST_REGISTER_EMAIL = process.env.PW_TEST_REGISTER_EMAIL || 'newcaregiver@grandcure.com';
const TEST_REGISTER_PASSWORD = process.env.PW_TEST_REGISTER_PASSWORD || 'ValidPass123!';
const TEST_PATIENT_NAME = process.env.PW_TEST_PATIENT_NAME || 'Test Patient';
const TEST_PATIENT_EMAIL = process.env.PW_TEST_PATIENT_EMAIL || 'patient@grandcure.com';
const TEST_PATIENT_PASSWORD = process.env.PW_TEST_PATIENT_PASSWORD || 'ValidPass123!';
const TEST_PATIENT_CONFIRM_PASSWORD =
  process.env.PW_TEST_PATIENT_CONFIRM_PASSWORD || 'DifferentPass123!';

function createMockJwt(role: 'CARE_GIVER' | 'PATIENT' = 'CARE_GIVER') {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: 1,
      email: TEST_LOGIN_EMAIL,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    }),
  ).toString('base64url');

  return `${header}.${payload}.signature`;
}

test.describe('GrandCure Authentication Flow', () => {
  test('shows client-side validation when login is submitted empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.submitEmptyForm();

    await expect(page.getByText('Please fix the highlighted fields and try again.')).toBeVisible();
    await expect(page.getByText('Work email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    await page.route('**/api/backend/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 200,
          message: 'success',
          data: {
            access_token: createMockJwt('CARE_GIVER'),
          },
        }),
      });
    });


    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TEST_LOGIN_EMAIL, TEST_LOGIN_PASSWORD);

    await expect(page).toHaveURL(/.*\/caregiver/);
  });

  test('shows API error when credentials are invalid', async ({ page }) => {
    await page.route('**/api/backend/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 401,
          message: 'Invalid credentials',
        }),
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TEST_INVALID_EMAIL, TEST_INVALID_PASSWORD);

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('registers a new caregiver and redirects to login with success message', async ({ page }) => {
    await page.route('**/api/backend/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 201,
          message: 'created',
          data: {
            id: 1,
            name: TEST_REGISTER_NAME,
            email: TEST_REGISTER_EMAIL,
            password: 'hashed',
            role: 'CARE_GIVER',
            isBlock: false,
            createdAt: new Date().toISOString(),
          },
        }),
      });
    });

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.chooseCaregiverRole();

    await expect(page).toHaveURL(/.*\/register\/details\?role=caregiver/);

    await registerPage.fillDetails({
      name: TEST_REGISTER_NAME,
      email: TEST_REGISTER_EMAIL,
      password: TEST_REGISTER_PASSWORD,
      confirmPassword: TEST_REGISTER_PASSWORD,
    });
    await registerPage.submit();

    await expect(page).toHaveURL(/.*\/login\?registered=1/);
    await expect(
      page.getByText('Registration successful. Please sign in with your new account.'),
    ).toBeVisible();
  });

  test('shows register validation when passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.choosePatientRole();

    await registerPage.fillDetails({
      name: TEST_PATIENT_NAME,
      email: TEST_PATIENT_EMAIL,
      password: TEST_PATIENT_PASSWORD,
      confirmPassword: TEST_PATIENT_CONFIRM_PASSWORD,
    });
    await registerPage.submit();

    await expect(page.getByText('Please fix the highlighted fields and try again.')).toBeVisible();
    await expect(page.getByText('Passwords do not match.')).toBeVisible();
  });
});
